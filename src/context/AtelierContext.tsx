/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BULK_CONTRACTS,
  INITIAL_MEASUREMENT_CARDS,
  INITIAL_ORDERS,
  INITIAL_RTW_ITEMS
} from '../data/initialData';
import {
  AtelierOrder,
  BulkContract,
  ClientMeasurementCard,
  CostBreakdown,
  OrderStage,
  RTWItem
} from '../types/atelier';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AtelierContextType {
  orders: AtelierOrder[];
  measurementCards: ClientMeasurementCard[];
  rtwItems: RTWItem[];
  bulkContracts: BulkContract[];
  
  viewMode: 'client' | 'studio';
  setViewMode: (mode: 'client' | 'studio') => void;
  
  activeClientView: 'lookbook' | 'bespoke' | 'rtw' | 'track' | 'styling';
  setActiveClientView: (view: 'lookbook' | 'bespoke' | 'rtw' | 'track' | 'styling') => void;
  
  activeStudioTab: 'pipeline' | 'costing' | 'measurements' | 'bulk' | 'analytics';
  setActiveStudioTab: (tab: 'pipeline' | 'costing' | 'measurements' | 'bulk' | 'analytics') => void;
  
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Actions
  createOrder: (order: Omit<AtelierOrder, 'id' | 'createdAt' | 'history'>) => AtelierOrder;
  updateOrderStage: (orderId: string, nextStage: OrderStage, note?: string) => void;
  recordDepositPayment: (orderId: string, amount: number) => void;
  recordFinalPayment: (orderId: string) => void;
  assignTailorToOrder: (orderId: string, tailorName: string, tailorType: 'in_house' | 'external_partner', phone?: string) => void;
  updateQualityInspection: (orderId: string, passed: boolean, notes: string) => void;
  
  createMeasurementCard: (card: Omit<ClientMeasurementCard, 'id' | 'updatedAt'>) => ClientMeasurementCard;
  updateMeasurementCard: (card: ClientMeasurementCard) => void;
  
  createBulkContract: (contract: Omit<BulkContract, 'id'>) => BulkContract;
  updateBulkContractStatus: (id: string, status: BulkContract['status']) => void;
  
  calculatePricing: (params: {
    fabricYardage: number;
    fabricCostPerYard: number;
    notionsCost: number;
    embroideryCost: number;
    laborHours: number;
    laborHourlyRate: number;
    packagingCost?: number;
    markupPercent: number;
    depositPercent?: number;
  }) => CostBreakdown;
  
  generateWhatsAppOrderMessage: (order: AtelierOrder) => string;
  generateWhatsAppInvoice: (order: AtelierOrder) => string;
  
  // Studio OS Security & Bank Details
  isStudioUnlocked: boolean;
  unlockStudio: (pin: string) => boolean;
  lockStudio: () => void;
  studioPin: string;
  setStudioPin: (pin: string) => void;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    note: string;
  };
  updateBankDetails: (details: Partial<{ bankName: string; accountNumber: string; accountName: string; note: string }>) => void;

  // VIP Client Registration Modal State
  isRegisterOpen: boolean;
  setIsRegisterOpen: (open: boolean) => void;

  resetToDefaults: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
}

const AtelierContext = createContext<AtelierContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORDERS: 'kilima_atelier_orders_v1',
  MEASUREMENTS: 'kilima_atelier_measurements_v1',
  RTW: 'kilima_atelier_rtw_v1',
  BULK: 'kilima_atelier_bulk_v1'
};

export const AtelierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<AtelierOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [measurementCards, setMeasurementCards] = useState<ClientMeasurementCard[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
      return saved ? JSON.parse(saved) : INITIAL_MEASUREMENT_CARDS;
    } catch {
      return INITIAL_MEASUREMENT_CARDS;
    }
  });

  const [rtwItems, setRtwItems] = useState<RTWItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RTW);
      if (!saved) return INITIAL_RTW_ITEMS;
      const parsed: RTWItem[] = JSON.parse(saved);
      return parsed.map((item) => ({
        ...item,
        image: item.image?.replace('/src/assets/images/', '/assets/images/') || item.image
      }));
    } catch {
      return INITIAL_RTW_ITEMS;
    }
  });

  const [bulkContracts, setBulkContracts] = useState<BulkContract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BULK);
      return saved ? JSON.parse(saved) : INITIAL_BULK_CONTRACTS;
    } catch {
      return INITIAL_BULK_CONTRACTS;
    }
  });

  const [viewMode, setViewMode] = useState<'client' | 'studio'>('client');
  const [activeClientView, setActiveClientView] = useState<'lookbook' | 'bespoke' | 'rtw' | 'track' | 'styling'>('lookbook');
  const [activeStudioTab, setActiveStudioTab] = useState<'pipeline' | 'costing' | 'measurements' | 'bulk' | 'analytics'>('pipeline');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  // Studio OS Security PIN (Default: '2026')
  const [studioPin, setStudioPinState] = useState<string>(() => {
    try {
      return localStorage.getItem('atx_studio_pin') || '2026';
    } catch {
      return '2026';
    }
  });

  const [isStudioUnlocked, setIsStudioUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('atx_studio_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Studio Official Bank Details for Deposits
  const [bankDetails, setBankDetails] = useState<{
    bankName: string;
    accountNumber: string;
    accountName: string;
    note: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('atx_studio_bank_details');
      return saved ? JSON.parse(saved) : {
        bankName: 'First Bank of Nigeria',
        accountNumber: '08150882291',
        accountName: 'ATX TECHNOLOGIES / ATX FASHION STUDIO',
        note: 'Kindly use your Order Reference ID in the transfer narration and send receipt via WhatsApp.'
      };
    } catch {
      return {
        bankName: 'First Bank of Nigeria',
        accountNumber: '08150882291',
        accountName: 'ATX TECHNOLOGIES / ATX FASHION STUDIO',
        note: 'Kindly use your Order Reference ID in the transfer narration and send receipt via WhatsApp.'
      };
    }
  });

  const setStudioPin = (newPin: string) => {
    setStudioPinState(newPin);
    try {
      localStorage.setItem('atx_studio_pin', newPin);
    } catch (e) {
      console.error(e);
    }
    showToast('Studio OS PIN updated successfully', 'success');
  };

  const unlockStudio = (enteredPin: string): boolean => {
    if (enteredPin === studioPin) {
      setIsStudioUnlocked(true);
      try {
        sessionStorage.setItem('atx_studio_unlocked', 'true');
      } catch (e) {
        console.error(e);
      }
      showToast('Studio Management OS unlocked', 'success');
      return true;
    }
    showToast('Incorrect Studio PIN. Access restricted.', 'warning');
    return false;
  };

  const lockStudio = () => {
    setIsStudioUnlocked(false);
    setViewMode('client');
    try {
      sessionStorage.removeItem('atx_studio_unlocked');
    } catch (e) {
      console.error(e);
    }
    showToast('Studio OS locked. Switched to Client Experience.', 'info');
  };

  const updateBankDetails = (details: Partial<typeof bankDetails>) => {
    setBankDetails((prev) => {
      const updated = { ...prev, ...details };
      try {
        localStorage.setItem('atx_studio_bank_details', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast('Bank transfer details updated successfully', 'success');
  };

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed saving orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(measurementCards));
    } catch (e) {
      console.error('Failed saving measurement cards', e);
    }
  }, [measurementCards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RTW, JSON.stringify(rtwItems));
    } catch (e) {
      console.error('Failed saving RTW items', e);
    }
  }, [rtwItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BULK, JSON.stringify(bulkContracts));
    } catch (e) {
      console.error('Failed saving bulk contracts', e);
    }
  }, [bulkContracts]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const calculatePricing = ({
    fabricYardage,
    fabricCostPerYard,
    notionsCost,
    embroideryCost,
    laborHours,
    laborHourlyRate,
    packagingCost = 4500,
    markupPercent,
    depositPercent = 60
  }: {
    fabricYardage: number;
    fabricCostPerYard: number;
    notionsCost: number;
    embroideryCost: number;
    laborHours: number;
    laborHourlyRate: number;
    packagingCost?: number;
    markupPercent: number;
    depositPercent?: number;
  }): CostBreakdown => {
    const fabricTotal = fabricYardage * fabricCostPerYard;
    const tailorLaborCost = laborHours * laborHourlyRate;
    const studioOverheadShare = Math.round((fabricTotal + tailorLaborCost) * 0.12);
    const totalCost = fabricTotal + notionsCost + embroideryCost + tailorLaborCost + packagingCost + studioOverheadShare;
    const recommendedRetailPrice = Math.round(totalCost * (1 + markupPercent / 100));
    const requiredDepositAmount = Math.round(recommendedRetailPrice * (depositPercent / 100));

    return {
      fabricYardage,
      fabricCostPerYard,
      fabricTotal,
      notionsAndTrimsCost: notionsCost,
      embroideryCost,
      tailorLaborCost,
      packagingAndTagsCost: packagingCost,
      studioOverheadShare,
      totalCost,
      markupPercentage: markupPercent,
      recommendedRetailPrice,
      minimumRequiredDepositPercentage: depositPercent,
      requiredDepositAmount
    };
  };

  const createOrder = (orderData: Omit<AtelierOrder, 'id' | 'createdAt' | 'history'>): AtelierOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `ATX-${randomNum}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: AtelierOrder = {
      ...orderData,
      id: newId,
      createdAt: now.substring(0, 10),
      history: [
        {
          stage: orderData.stage,
          timestamp: now,
          note: `Order initiated for ${orderData.clientName} (${orderData.garmentTitle}).`
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order ${newId} created for ${newOrder.clientName}!`, 'success');
    return newOrder;
  };

  const updateOrderStage = (orderId: string, nextStage: OrderStage, note?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        // Lean finance gate check: warn if moving past stage 4 without deposit
        if (nextStage >= 5 && !order.depositPaid) {
          showToast(`Warning: Order ${order.id} has no deposit recorded! In lean operations, materials must be funded by deposits.`, 'warning');
        }

        const stageNote = note || `Advanced to Stage ${nextStage}`;
        return {
          ...order,
          stage: nextStage,
          history: [...order.history, { stage: nextStage, timestamp: now, note: stageNote }]
        };
      })
    );

    showToast(`Order ${orderId} progressed to Stage ${nextStage}`, 'info');
  };

  const recordDepositPayment = (orderId: string, amount: number) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          depositPaid: true,
          depositPaidAt: now,
          depositAmount: amount,
          stage: order.stage < 4 ? 4 : order.stage,
          history: [
            ...order.history,
            {
              stage: 4,
              timestamp: now,
              note: `Deposit of ₦${amount.toLocaleString()} confirmed received.`
            }
          ]
        };
      })
    );

    showToast(`Deposit of ₦${amount.toLocaleString()} logged for ${orderId}`, 'success');
  };

  const recordFinalPayment = (orderId: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const balance = Math.max(0, order.quotedPrice - order.depositAmount);
        return {
          ...order,
          finalPaymentPaid: true,
          finalPaymentPaidAt: now,
          stage: order.stage < 9 ? 9 : order.stage,
          history: [
            ...order.history,
            {
              stage: 9,
              timestamp: now,
              note: `Final balance of ₦${balance.toLocaleString()} cleared in full.`
            }
          ]
        };
      })
    );

    showToast(`Final balance cleared for ${orderId}`, 'success');
  };

  const assignTailorToOrder = (
    orderId: string,
    tailorName: string,
    tailorType: 'in_house' | 'external_partner',
    phone?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          assignedTailorName: tailorName,
          assignedTailorType: tailorType,
          assignedTailorPhone: phone || order.assignedTailorPhone
        };
      })
    );
    showToast(`Assigned ${tailorName} to ${orderId}`, 'info');
  };

  const updateQualityInspection = (orderId: string, passed: boolean, notes: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          qualityCheckPassed: passed,
          qualityCheckNotes: notes,
          stage: passed && order.stage < 7 ? 7 : order.stage,
          history: [
            ...order.history,
            {
              stage: 7,
              timestamp: now,
              note: passed
                ? `Passed studio quality audit: ${notes}`
                : `Quality inspection flagged corrections needed: ${notes}`
            }
          ]
        };
      })
    );

    showToast(passed ? `Quality check passed for ${orderId}` : `Revision notes logged for ${orderId}`, passed ? 'success' : 'warning');
  };

  const createMeasurementCard = (cardData: Omit<ClientMeasurementCard, 'id' | 'updatedAt'>): ClientMeasurementCard => {
    const id = `meas-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString().substring(0, 10);
    const newCard: ClientMeasurementCard = {
      ...cardData,
      id,
      updatedAt: now
    };

    setMeasurementCards((prev) => [newCard, ...prev]);
    showToast(`Measurement profile created for ${newCard.fullName}`, 'success');
    return newCard;
  };

  const updateMeasurementCard = (card: ClientMeasurementCard) => {
    const now = new Date().toISOString().substring(0, 10);
    const updated = { ...card, updatedAt: now };

    setMeasurementCards((prev) => prev.map((item) => (item.id === card.id ? updated : item)));
    showToast(`Updated measurements for ${card.fullName}`, 'success');
  };

  const createBulkContract = (contractData: Omit<BulkContract, 'id'>): BulkContract => {
    const id = `BLK-${Math.floor(10 + Math.random() * 90)}`;
    const newContract: BulkContract = {
      ...contractData,
      id
    };
    setBulkContracts((prev) => [newContract, ...prev]);
    showToast(`Bulk contract logged for ${contractData.organizationName}!`, 'success');
    return newContract;
  };

  const updateBulkContractStatus = (id: string, status: BulkContract['status']) => {
    setBulkContracts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    showToast(`Updated contract ${id} status to ${status.replace('_', ' ')}`, 'info');
  };

  const generateWhatsAppOrderMessage = (order: AtelierOrder): string => {
    const balance = Math.max(0, order.quotedPrice - (order.depositPaid ? order.depositAmount : 0));
    return `*ATX FASHION STUDIO — BESPOKE COMMISSION UPDATE*
Hello ${order.clientName},
Thank you for entrusting ATX FASHION STUDIO with your custom creation:

*Order Reference:* ${order.id}
*Garment:* ${order.garmentTitle}
*Current Stage:* Stage ${order.stage} of 10
*Target Delivery Date:* ${order.targetDeliveryDate}

*Financial Summary:*
• Quoted Investment: ₦${order.quotedPrice.toLocaleString()}
• Deposit Status: ${order.depositPaid ? `₦${order.depositAmount.toLocaleString()} (CONFIRMED)` : `₦${order.depositAmount.toLocaleString()} (PENDING)`}
• Balance Due: ₦${balance.toLocaleString()}

*Fabric & Silhouette:* ${order.fabricDescription}

For inquiries or fitting updates, please reply directly to this message.
_Modern Elegance Meets African Luxury_`;
  };

  const generateWhatsAppInvoice = (order: AtelierOrder): string => {
    return `*ATX FASHION STUDIO — FORMAL COMMISSION INVOICE*
*Invoice No:* ${order.id}
*Date:* ${order.createdAt}
*Client:* ${order.clientName}
*Phone:* ${order.clientPhone}

*Garment Description:*
1x ${order.garmentTitle} (${order.division.replace('_', ' ').toUpperCase()})
• Fabric: ${order.fabricDescription}
• Palette: ${order.colorPalette}

*Price Breakdown:*
Total Commission Value: ₦${order.quotedPrice.toLocaleString()}
Initial Working Deposit (60%): ₦${order.depositAmount.toLocaleString()}
Remaining Balance on Fitting: ₦${(order.quotedPrice - order.depositAmount).toLocaleString()}

*Official Bank Transfer Details:*
Bank: ${bankDetails.bankName}
Account Name: ${bankDetails.accountName}
Account No: ${bankDetails.accountNumber}
Narration: Ref ${order.id}

_${bankDetails.note}_
_Kindly attach payment receipt on WhatsApp to initiate fabric procurement & cutting._`;
  };

  const resetToDefaults = () => {
    setOrders(INITIAL_ORDERS);
    setMeasurementCards(INITIAL_MEASUREMENT_CARDS);
    setRtwItems(INITIAL_RTW_ITEMS);
    setBulkContracts(INITIAL_BULK_CONTRACTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.MEASUREMENTS);
    localStorage.removeItem(STORAGE_KEYS.RTW);
    localStorage.removeItem(STORAGE_KEYS.BULK);
    showToast('Studio database reset to initial demonstration state', 'info');
  };

  const exportDatabaseJSON = () => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      bankDetails,
      orders,
      measurementCards,
      rtwItems,
      bulkContracts
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atx_fashion_studio_backup_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('ATX database backup exported successfully', 'success');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      if (parsed.measurementCards && Array.isArray(parsed.measurementCards)) {
        setMeasurementCards(parsed.measurementCards);
      }
      if (parsed.rtwItems && Array.isArray(parsed.rtwItems)) {
        setRtwItems(parsed.rtwItems);
      }
      if (parsed.bulkContracts && Array.isArray(parsed.bulkContracts)) {
        setBulkContracts(parsed.bulkContracts);
      }
      if (parsed.bankDetails) {
        setBankDetails(parsed.bankDetails);
      }
      showToast('Database backup successfully restored!', 'success');
      return true;
    } catch (e) {
      console.error(e);
      showToast('Failed to parse backup JSON file', 'warning');
      return false;
    }
  };

  return (
    <AtelierContext.Provider
      value={{
        orders,
        measurementCards,
        rtwItems,
        bulkContracts,
        viewMode,
        setViewMode,
        activeClientView,
        setActiveClientView,
        activeStudioTab,
        setActiveStudioTab,
        selectedOrderId,
        setSelectedOrderId,
        toasts,
        showToast,
        dismissToast,
        createOrder,
        updateOrderStage,
        recordDepositPayment,
        recordFinalPayment,
        assignTailorToOrder,
        updateQualityInspection,
        createMeasurementCard,
        updateMeasurementCard,
        createBulkContract,
        updateBulkContractStatus,
        calculatePricing,
        generateWhatsAppOrderMessage,
        generateWhatsAppInvoice,
        isStudioUnlocked,
        unlockStudio,
        lockStudio,
        studioPin,
        setStudioPin,
        bankDetails,
        updateBankDetails,
        isRegisterOpen,
        setIsRegisterOpen,
        resetToDefaults,
        exportDatabaseJSON,
        importDatabaseJSON
      }}
    >
      {children}
    </AtelierContext.Provider>
  );
};

export const useAtelier = () => {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error('useAtelier must be used within an AtelierProvider');
  }
  return context;
};
