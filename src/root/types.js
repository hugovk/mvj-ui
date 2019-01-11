// @flow
import type {ApiState} from '$src/api/types';
import type {AreaNoteState} from '$src/areaNote/types';
import type {AuthState} from '$src/auth/types';
import type {BillingPeriodState} from '$src/billingPeriods/types';
import type {CollectionCourtDecisionState} from '$src/collectionCourtDecision/types';
import type {CollectionLetterState} from '$src/collectionLetter/types';
import type {CollectionNoteState} from '$src/collectionNote/types';
import type {CommentState} from '$src/comments/types';
import type {ContactState} from '$src/contacts/types';
import type {CopyAreasToContractState} from '$src/copyAreasToContract/types';
import type {CreateCollectionLetterState} from '$src/createCollectionLetter/types';
import type {DecisionState} from '$src/decision/types';
import type {DistrictState} from '$src/district/types';
import type {InfillDevelopmentState} from '$src/infillDevelopment/types';
import type {InfillDevelopmentAttachmentState} from '$src/infillDevelopmentAttachment/types';
import type {InvoiceState} from '$src/invoices/types';
import type {InvoiceSetState} from '$src/invoiceSets/types';
import type {LandUseContractState} from '$src/landUseContract/types';
import type {LeaseState} from '$src/leases/types';
import type {LeaseTypeState} from '$src/leaseType/types';
import type {MapDataState} from '$src/mapData/types';
import type {PenaltyInterestState} from '$src/penaltyInterest/types';
import type {PreviewInvoicesState} from '$src/previewInvoices/types';
import type {RelatedLeaseState} from '$src/relatedLease/types';
import type {RentBasisState} from '$src/rentbasis/types';
import type {RentForPeriodState} from '$src/rentForPeriod/types';
import type {SetInvoicingStateState} from '$src/setInvoicingState/types';
import type {SetRentInfoCompletionStateState} from '$src/setRentInfoCompletionState/types';
import type {UserState} from '../users/types';
import type {VatState} from '$src/vat/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  areaNote: AreaNoteState,
  billingPeriod: BillingPeriodState,
  collectionCourtDecision: CollectionCourtDecisionState,
  collectionLetter: CollectionLetterState,
  collectionNote: CollectionNoteState,
  comment: CommentState,
  contact: ContactState,
  copyAreasToContract: CopyAreasToContractState,
  createCollectionLetter: CreateCollectionLetterState,
  decision: DecisionState,
  district: DistrictState,
  form: Object,
  infillDevelopment: InfillDevelopmentState,
  infillDevelopmentAttachment: InfillDevelopmentAttachmentState,
  invoice: InvoiceState,
  invoiceSet: InvoiceSetState,
  landUseContract: LandUseContractState,
  lease: LeaseState,
  leaseType: LeaseTypeState,
  mapData: MapDataState,
  penaltyInterest: PenaltyInterestState,
  previewInvoices: PreviewInvoicesState,
  relatedLease: RelatedLeaseState,
  rentBasis: RentBasisState,
  rentForPeriod: RentForPeriodState,
  setInvoicingState: SetInvoicingStateState,
  setRentInfoCompletionState: SetRentInfoCompletionStateState,
  user: UserState,
  vat: VatState,
};
