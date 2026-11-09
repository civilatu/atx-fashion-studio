/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrderStageDefinition } from '../types/atelier';

export const ORDER_STAGES: OrderStageDefinition[] = [
  {
    stage: 1,
    title: 'Client Enquiry',
    shortDesc: 'Initial consultation and styling intent',
    category: 'onboarding',
    color: '#9CA3AF'
  },
  {
    stage: 2,
    title: 'Design Selected',
    shortDesc: 'Garment silhouette, fabric & styling agreed',
    category: 'onboarding',
    color: '#D4AF37'
  },
  {
    stage: 3,
    title: 'Measurements Taken',
    shortDesc: 'Anatomical fitting profile & swatch logged',
    category: 'prep',
    color: '#F59E0B'
  },
  {
    stage: 4,
    title: 'Deposit Secured',
    shortDesc: '60% working capital deposit cleared',
    category: 'prep',
    color: '#10B981'
  },
  {
    stage: 5,
    title: 'Materials Sourced',
    shortDesc: 'Fabric, lining, thread & notions prepared',
    category: 'craft',
    color: '#3B82F6'
  },
  {
    stage: 6,
    title: 'In Production',
    shortDesc: 'Pattern cutting, basting & master tailoring',
    category: 'craft',
    color: '#C85A32'
  },
  {
    stage: 7,
    title: 'Quality Inspection',
    shortDesc: 'Finishing, hem checks, lining & seam audit',
    category: 'craft',
    color: '#8B5CF6'
  },
  {
    stage: 8,
    title: 'Client Fitting',
    shortDesc: 'Fitting verification & minor adjustments',
    category: 'fulfillment',
    color: '#EC4899'
  },
  {
    stage: 9,
    title: 'Final Payment',
    shortDesc: 'Balance cleared before garment dispatch',
    category: 'fulfillment',
    color: '#059669'
  },
  {
    stage: 10,
    title: 'Completed & Delivered',
    shortDesc: 'Delivered in luxury ATX packaging',
    category: 'fulfillment',
    color: '#D4AF37'
  }
];

export const DIVISION_LABELS: Record<string, string> = {
  custom_tailoring: 'Custom Bespoke Tailoring',
  ready_to_wear: 'Ready-to-Wear (RTW)',
  bulk_production: 'Institutional & Bulk Contracts',
  styling_consultation: 'Personal Styling & Wardrobe'
};

export const TIER_LABELS: Record<string, { name: string; tag: string; description: string }> = {
  affordable: {
    name: 'Affordable Collection',
    tag: 'Everyday Accessible',
    description: 'Clean modern African cuts with durable, breathable fabrics for daily poise.'
  },
  classic: {
    name: 'Classic Collection',
    tag: 'Signature Contemporary',
    description: 'Sophisticated silhouettes, premium cotton & wool blends with refined finishing.'
  },
  premium: {
    name: 'Premium Collection',
    tag: 'Haute Couture & Heritage',
    description: 'Bespoke handwoven Aso-Oke, pure silk, intricate bullion gold embroidery, and museum-grade craft.'
  }
};
