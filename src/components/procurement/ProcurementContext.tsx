import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  VendorProfile,
  ProcurementRequest,
  PurchaseRequisition,
  RequestForQuotation,
  VendorQuotation,
  ComparativeStatement,
  PurchaseOrder,
  GoodsReceipt,
  QualityInspection,
  ProcurementReturn,
  ProcurementContract,
  ProcurementException,
  ProcurementAnalyticsSummary
} from '../../types/procurement';
import { ProcurementService, UserActor } from '../../services/procurementService';
import { useNotification } from '../../context/NotificationContext';
import { Campus } from '../../types';
import { FirebaseService } from '../../services/firebaseService';

interface ProcurementContextType {
  tenantId: string;
  currentUser: UserActor;
  campuses: Campus[];
  selectedCampusId: string;
  setSelectedCampusId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  vendors: VendorProfile[];
  requests: ProcurementRequest[];
  requisitions: PurchaseRequisition[];
  rfqs: RequestForQuotation[];
  quotations: VendorQuotation[];
  comparativeStatements: ComparativeStatement[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
  inspections: QualityInspection[];
  returns: ProcurementReturn[];
  contracts: ProcurementContract[];
  exceptions: ProcurementException[];
  analytics: ProcurementAnalyticsSummary | null;
  refreshAll: () => Promise<void>;
  createVendor: (data: any) => Promise<void>;
  verifyVendor: (vendorId: string, status: 'VERIFIED' | 'REJECTED') => Promise<void>;
  suspendVendor: (vendorId: string, reason: string) => Promise<void>;
  createRequest: (data: any) => Promise<void>;
  submitRequest: (id: string) => Promise<void>;
  approveRequest: (id: string, comment: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  createRequisition: (data: any) => Promise<void>;
  createRFQ: (data: any) => Promise<void>;
  submitQuotation: (data: any) => Promise<void>;
  createComparison: (data: any) => Promise<void>;
  createPO: (data: any) => Promise<void>;
  issuePO: (id: string) => Promise<void>;
  createGRN: (data: any) => Promise<void>;
  createInspection: (data: any) => Promise<void>;
  createReturn: (data: any) => Promise<void>;
  createContract: (data: any) => Promise<void>;
  createException: (data: any) => Promise<void>;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{
  tenantId: string;
  currentUser: UserActor;
  children: React.ReactNode;
}> = ({ tenantId, currentUser, children }) => {
  const { notify } = useNotification();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [vendors, setVendors] = useState<VendorProfile[]>([]);
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([]);
  const [rfqs, setRfqs] = useState<RequestForQuotation[]>([]);
  const [quotations, setQuotations] = useState<VendorQuotation[]>([]);
  const [comparativeStatements, setComparativeStatements] = useState<ComparativeStatement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [inspections, setInspections] = useState<QualityInspection[]>([]);
  const [returns, setReturns] = useState<ProcurementReturn[]>([]);
  const [contracts, setContracts] = useState<ProcurementContract[]>([]);
  const [exceptions, setExceptions] = useState<ProcurementException[]>([]);
  const [analytics, setAnalytics] = useState<ProcurementAnalyticsSummary | null>(null);

  const refreshAll = useCallback(async () => {
    if (!tenantId) return;
    setIsLoading(true);
    try {
      const campList = await FirebaseService.getTenantCollection<Campus>('campuses', tenantId);
      setCampuses(campList);

      const campusFilter = selectedCampusId === 'all' ? undefined : selectedCampusId;

      const [vList, reqList, reqnList, rfqList, qList, cmpList, poList, grnList, inspList, retList, cntList, excList, anl] = await Promise.all([
        ProcurementService.getVendors(tenantId, campusFilter),
        ProcurementService.getRequests(tenantId, campusFilter),
        ProcurementService.getRequisitions(tenantId, campusFilter),
        ProcurementService.getRFQs(tenantId, campusFilter),
        ProcurementService.getQuotations(tenantId, campusFilter),
        ProcurementService.getComparativeStatements(tenantId, campusFilter),
        ProcurementService.getPurchaseOrders(tenantId, campusFilter),
        ProcurementService.getGoodsReceipts(tenantId, campusFilter),
        ProcurementService.getInspections(tenantId, campusFilter),
        ProcurementService.getReturns(tenantId, campusFilter),
        ProcurementService.getContracts(tenantId, campusFilter),
        ProcurementService.getExceptions(tenantId, campusFilter),
        ProcurementService.getAnalyticsSummary(tenantId, campusFilter)
      ]);

      setVendors(vList);
      setRequests(reqList);
      setRequisitions(reqnList);
      setRfqs(rfqList);
      setQuotations(qList);
      setComparativeStatements(cmpList);
      setPurchaseOrders(poList);
      setGoodsReceipts(grnList);
      setInspections(inspList);
      setReturns(retList);
      setContracts(cntList);
      setExceptions(excList);
      setAnalytics(anl);
    } catch (err: any) {
      console.error('Failed to load procurement data:', err);
      notify({ type: 'error', title: 'Data Error', message: err.message || 'Failed to load procurement data' });
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, selectedCampusId, notify]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    try {
      await actionFn();
      notify({ type: 'success', title: 'Success', message: successMsg });
      await refreshAll();
    } catch (err: any) {
      console.error(err);
      notify({ type: 'error', title: 'Action Failed', message: err.message || 'Operation failed' });
    }
  };

  const createVendor = (data: any) => handleAction(() => ProcurementService.createVendor(tenantId, data, currentUser), 'Vendor onboarded successfully');
  const verifyVendor = (vendorId: string, status: 'VERIFIED' | 'REJECTED') => handleAction(() => ProcurementService.verifyVendor(tenantId, vendorId, status, currentUser), `Vendor ${status.toLowerCase()} successfully`);
  const suspendVendor = (vendorId: string, reason: string) => handleAction(() => ProcurementService.suspendVendor(tenantId, vendorId, reason, currentUser), 'Vendor suspended');

  const createRequest = (data: any) => handleAction(() => ProcurementService.createRequest(tenantId, data, currentUser), 'Procurement request created');
  const submitRequest = (id: string) => handleAction(() => ProcurementService.submitRequest(tenantId, id, currentUser), 'Request submitted for approval');
  const approveRequest = (id: string, comment: string) => handleAction(() => ProcurementService.approveRequest(tenantId, id, comment, currentUser), 'Request approved');
  const rejectRequest = (id: string, reason: string) => handleAction(() => ProcurementService.rejectRequest(tenantId, id, reason, currentUser), 'Request rejected');

  const createRequisition = (data: any) => handleAction(() => ProcurementService.createRequisition(tenantId, data, currentUser), 'Purchase requisition created');
  const createRFQ = (data: any) => handleAction(() => ProcurementService.createRFQ(tenantId, data, currentUser), 'RFQ published');
  const submitQuotation = (data: any) => handleAction(() => ProcurementService.submitQuotation(tenantId, data, currentUser), 'Vendor quotation logged');
  const createComparison = (data: any) => handleAction(() => ProcurementService.createComparison(tenantId, data, currentUser), 'Comparative statement generated');
  const createPO = (data: any) => handleAction(() => ProcurementService.createPO(tenantId, data, currentUser), 'Purchase order created');
  const issuePO = (id: string) => handleAction(() => ProcurementService.issuePO(tenantId, id, currentUser), 'Purchase order issued to vendor');
  const createGRN = (data: any) => handleAction(() => ProcurementService.createGRN(tenantId, data, currentUser), 'Goods receipt recorded');
  const createInspection = (data: any) => handleAction(() => ProcurementService.createInspection(tenantId, data, currentUser), 'Quality inspection recorded');
  const createReturn = (data: any) => handleAction(() => ProcurementService.createReturn(tenantId, data, currentUser), 'Procurement return logged');
  const createContract = (data: any) => handleAction(() => ProcurementService.createContract(tenantId, data, currentUser), 'Procurement contract registered');
  const createException = (data: any) => handleAction(() => ProcurementService.createException(tenantId, data, currentUser), 'Exception logged and authorized');

  return (
    <ProcurementContext.Provider
      value={{
        tenantId,
        currentUser,
        campuses,
        selectedCampusId,
        setSelectedCampusId,
        activeTab,
        setActiveTab,
        isLoading,
        vendors,
        requests,
        requisitions,
        rfqs,
        quotations,
        comparativeStatements,
        purchaseOrders,
        goodsReceipts,
        inspections,
        returns,
        contracts,
        exceptions,
        analytics,
        refreshAll,
        createVendor,
        verifyVendor,
        suspendVendor,
        createRequest,
        submitRequest,
        approveRequest,
        rejectRequest,
        createRequisition,
        createRFQ,
        submitQuotation,
        createComparison,
        createPO,
        issuePO,
        createGRN,
        createInspection,
        createReturn,
        createContract,
        createException
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurementContext = () => {
  const context = useContext(ProcurementContext);
  if (!context) throw new Error('useProcurementContext must be used within a ProcurementProvider');
  return context;
};
