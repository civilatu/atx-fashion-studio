/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BusinessDivision = 
  | 'custom_tailoring'
  | 'ready_to_wear'
  | 'bulk_production'
  | 'styling_consultation';

export type CollectionTier = 'affordable' | 'classic' | 'premium';

export type GarmentCategory = 
  | 'mens_traditional'    // Agbada, Senator, Kaftan
  | 'mens_contemporary'   // Shirts, Trousers, Safari
  | 'womens_traditional'  // Aso-Oke, Iro & Buba, Traditional Wrapper
  | 'womens_contemporary' // Ankara dresses, Corporate suits, Evening gowns
  | 'wedding_occasion'    // Bridal, Groom, Aso-Ebi groups
  | 'children'            // Boy's & Girl's tailored traditional & casual
  | 'uniforms';           // School, Corporate, Hospitality

export type OrderStage = 
  | 1  // 1. Inquiry made
  | 2  // 2. Design & Service Selected
  | 3  // 3. Measurements & Fabric Obtained
  | 4  // 4. Deposit Secured (Crucial Lean Finance Gate)
  | 5  // 5. Materials & Fabric Sourced
  | 6  // 6. Production (Cutting & Sewing)
  | 7  // 7. Quality & Finishing Inspection
  | 8  // 8. Client Fitting & Minor Adjustments
  | 9  // 9. Final Payment Received
  | 10; // 10. Completed & Delivered

export interface OrderStageDefinition {
  stage: OrderStage;
  title: string;
  shortDesc: string;
  category: 'onboarding' | 'prep' | 'craft' | 'fulfillment';
  color: string;
}

export interface ClientMeasurementCard {
  id: string;
  fullName: string;
  gender: 'male' | 'female' | 'child';
  phone: string;
  email?: string;
  city: string;
  notes?: string;
  unit: 'inches' | 'cm';
  updatedAt: string;
  
  // Upper body
  neck?: number;
  chestOrBust?: number;
  underbust?: number;
  waist?: number;
  shoulderWidth?: number;
  sleeveLength?: number;
  bicep?: number;
  wrist?: number;
  shirtOrTopLength?: number;
  
  // Lower body
  highHip?: number;
  fullHip?: number;
  trouserOrSkirtLength?: number;
  waistToKnee?: number;
  thigh?: number;
  knee?: number;
  ankleOrHem?: number;
  
  // Traditional African tailoring specifics
  agbadaSpan?: number; // wrist to wrist across shoulders
  agbadaLength?: number;
  capOrFilaSize?: number;
}

export interface CostBreakdown {
  fabricYardage: number;
  fabricCostPerYard: number;
  fabricTotal: number;
  notionsAndTrimsCost: number; // lining, buttons, zippers, thread, interfacing
  embroideryCost: number;
  tailorLaborCost: number;
  packagingAndTagsCost: number;
  studioOverheadShare: number;
  totalCost: number;
  markupPercentage: number;
  recommendedRetailPrice: number;
  minimumRequiredDepositPercentage: number; // default 60%
  requiredDepositAmount: number;
}

export interface AtelierOrder {
  id: string; // e.g., KLM-1024
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  division: BusinessDivision;
  garmentCategory: GarmentCategory;
  garmentTitle: string;
  tier: CollectionTier;
  stage: OrderStage;
  createdAt: string;
  targetDeliveryDate: string;
  
  // Fabric & design details
  fabricSource: 'client_provided' | 'atelier_sourced';
  fabricDescription: string;
  colorPalette: string;
  specialInstructions?: string;
  
  // Measurement linkage
  measurementCardId?: string;
  customMeasurementsSnapshot?: Partial<ClientMeasurementCard>;
  
  // Financials in Nigerian Naira (₦)
  costBreakdown: CostBreakdown;
  quotedPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  depositPaidAt?: string;
  finalPaymentPaid: boolean;
  finalPaymentPaidAt?: string;
  
  // Production assignment
  assignedTailorType: 'in_house' | 'external_partner';
  assignedTailorName: string;
  assignedTailorPhone?: string;
  
  // Quality check notes
  qualityCheckPassed: boolean;
  qualityCheckNotes?: string;
  
  // Timeline log
  history: {
    stage: OrderStage;
    timestamp: string;
    note: string;
  }[];
}

export interface RTWItem {
  id: string;
  title: string;
  tier: CollectionTier;
  category: GarmentCategory;
  priceNGN: number;
  description: string;
  fabric: string;
  availableSizes: string[];
  stockCount: number;
  image: string;
  highlights: string[];
}

export interface BulkContract {
  id: string;
  organizationName: string;
  contractType: 'school_uniform' | 'corporate_uniform' | 'church_uniform' | 'hospitality' | 'event_aso_ebi';
  contactPerson: string;
  phone: string;
  quantityPieces: number;
  unitPriceNGN: number;
  totalContractValueNGN: number;
  depositPaidNGN: number;
  status: 'draft' | 'deposit_pending' | 'fabric_procurement' | 'mass_production' | 'completed';
  deliveryDeadline: string;
  notes: string;
}
