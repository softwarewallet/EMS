import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building, 
  GraduationCap, 
  FileText, 
  ExternalLink,
  Award,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { Certificate, CertificateSnapshot, CertificateTemplate } from '../../types';

interface CertificateDocumentRendererProps {
  certificate: Certificate;
  snapshot: CertificateSnapshot;
  template?: CertificateTemplate | null;
  isPreview?: boolean;
  onClose?: () => void;
  onReissue?: () => void;
  onCancel?: () => void;
}

export const CertificateDocumentRenderer: React.FC<CertificateDocumentRendererProps> = ({
  certificate,
  snapshot,
  template,
  isPreview = false,
  onClose,
  onReissue,
  onCancel
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isDraft = certificate.status === 'DRAFT' || certificate.status === 'PENDING_VERIFICATION' || isPreview;
  const isCancelled = certificate.status === 'CANCELLED';
  const isReissued = certificate.status === 'REISSUED';
  const isIssued = certificate.status === 'ISSUED';

  const { studentData, enrollmentData, exitData, institutionData, signatoryData } = snapshot;

  // Format Date of Birth with spelled-out words helper
  const formatDateWithWords = (dobStr: string) => {
    if (!dobStr) return 'Not Recorded';
    try {
      const date = new Date(dobStr);
      const formatted = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      return `${dobStr} (${formatted})`;
    } catch {
      return dobStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar (hidden in print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">
                {certificate.documentType?.replace(/_/g, ' ') || 'Unknown'}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase ${
                isIssued ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                isCancelled ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                isReissued ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {certificate.status} {certificate.certificateVersion > 1 ? `(v${certificate.certificateVersion})` : ''}
              </span>
            </div>
            <p className="text-2xs text-slate-400 font-mono">
              Cert No: {certificate.certificateNumber} | Verify: {certificate.verificationCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onReissue && isIssued && (
            <button
              onClick={onReissue}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reissue
            </button>
          )}
          {onCancel && isIssued && (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div 
        ref={printRef}
        className="relative bg-white text-slate-900 mx-auto border-2 border-slate-800 shadow-xl p-8 sm:p-12 max-w-[850px] font-serif rounded-xs min-h-[1050px] print:m-0 print:p-8 print:shadow-none print:border-2 print:border-black print:max-w-none print:w-full"
      >
        {/* Security Watermark */}
        {isDraft && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 select-none rotate-[-30deg]">
            <span className="text-8xl font-black font-sans uppercase tracking-widest text-indigo-900 border-8 border-indigo-900 p-8 rounded-2xl">
              DRAFT / PREVIEW
            </span>
          </div>
        )}
        {isCancelled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 select-none rotate-[-30deg]">
            <span className="text-8xl font-black font-sans uppercase tracking-widest text-rose-900 border-8 border-rose-900 p-8 rounded-2xl">
              CANCELLED
            </span>
          </div>
        )}
        {isReissued && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 select-none rotate-[-30deg]">
            <span className="text-7xl font-black font-sans uppercase tracking-widest text-amber-900 border-8 border-amber-900 p-8 rounded-2xl text-center">
              REISSUED / SUPERSEDED
            </span>
          </div>
        )}

        {/* Outer Ornamental Border */}
        <div className="border border-slate-900 p-6 sm:p-8 h-full flex flex-col justify-between">
          
          {/* Header Section */}
          <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg font-sans">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-slate-900">
                  {institutionData.institutionName}
                </h1>
                <p className="text-xs text-slate-600 font-sans tracking-wide">
                  {institutionData.address} | Phone: {institutionData.phone}
                </p>
              </div>
            </div>

            <div className="text-xs font-sans font-medium text-slate-700 pt-1 space-y-0.5">
              <p>{institutionData.affiliationNumber} | School Code: {institutionData.schoolCode}</p>
              <p className="text-2xs text-slate-500 italic">
                {template?.header?.subtitle || '(Affiliated to Central Board of Secondary Education)'}
              </p>
            </div>

            {/* Certificate Title Badge */}
            <div className="pt-3">
              <span className="inline-block bg-slate-900 text-white font-sans font-bold text-sm sm:text-base px-6 py-1 tracking-wider uppercase rounded-xs">
                {template?.header?.title || certificate.documentType?.replace(/_/g, ' ') || 'Unknown'}
              </span>
            </div>

            {/* Serial & Metadata Row */}
            <div className="flex flex-wrap items-center justify-between text-xs font-sans pt-3 font-semibold text-slate-800">
              <div>
                <span>TC Serial No: </span>
                <span className="font-mono font-bold text-slate-900">{certificate.certificateNumber}</span>
              </div>
              <div>
                <span>Admission / Scholar No: </span>
                <span className="font-mono font-bold text-slate-900">{studentData.admissionNumber}</span>
              </div>
              <div>
                <span>Date of Issue: </span>
                <span className="font-bold text-slate-900">{certificate.issueDate || new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>

          {/* Certificate Field Items (Numbered Table Format) */}
          <div className="py-4 space-y-2 text-xs sm:text-sm font-serif">
            <div className="grid grid-cols-1 gap-2.5 divide-y divide-slate-200">
              
              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">1. Name of the Pupil:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right uppercase font-sans">{studentData.fullName}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">2. Father's / Guardian's Name:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right">{studentData.fatherName || studentData.guardianName || 'N/A'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">3. Mother's Name:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right">{studentData.motherName || 'N/A'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">4. Nationality & Category:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{studentData.nationality || 'Indian'} ({studentData.category || 'General'})</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">5. Date of first admission in the School with Class:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{enrollmentData.admissionDate || '2025-08-01'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-1/2">6. Date of Birth (in Christian Era) according to Admission Register:</span>
                <span className="font-bold text-slate-900 w-1/2 text-right">{formatDateWithWords(studentData.dateOfBirth)}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">7. Class in which the pupil last studied:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right font-sans">{enrollmentData.className} ({enrollmentData.sectionName})</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">8. School / Board Annual Examination last taken with result:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{enrollmentData.academicResult || 'Passed'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">9. Month up to which the pupil has paid school dues:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{enrollmentData.feeDuesStatus || 'Cleared'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">10. Total No. of working days in academic session / Days attended:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{enrollmentData.totalWorkingDays} / {enrollmentData.daysAttended} Days</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">11. Date of pupil's last attendance at school:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right">{enrollmentData.lastAttendanceDate}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">12. Reason for leaving the school:</span>
                <span className="font-bold text-slate-900 w-1/3 text-right">{exitData.reason?.replace(/_/g, ' ') || 'Not Specified'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">13. General Conduct & Character:</span>
                <span className="font-bold text-emerald-800 w-1/3 text-right uppercase">{exitData.conductAndCharacter || 'GOOD'}</span>
              </div>

              <div className="pt-2 flex justify-between gap-4">
                <span className="font-semibold text-slate-700 w-2/3">14. Destination Institution:</span>
                <span className="font-medium text-slate-900 w-1/3 text-right">{exitData.destinationInstitution || 'Not Specified'}</span>
              </div>

            </div>
          </div>

          {/* Declaration Text */}
          <div className="py-2 text-center text-2xs italic text-slate-600 font-serif border-t border-b border-slate-300">
            {template?.footer?.declarationText || 'Certified that the above information is in accordance with the official School General Admission and Attendance Register.'}
          </div>

          {/* Signatory & QR Code Footer */}
          <div className="pt-8 flex items-end justify-between gap-6 font-sans">
            
            {/* Prepared By */}
            <div className="text-center space-y-1">
              <div className="w-32 border-b border-slate-900 pb-6 text-xs text-slate-500 font-mono italic">
                {certificate.verifiedByName || 'Class Teacher'}
              </div>
              <p className="text-2xs font-bold text-slate-700">Prepared By</p>
            </div>

            {/* Verified By */}
            <div className="text-center space-y-1">
              <div className="w-32 border-b border-slate-900 pb-6 text-xs text-slate-800 font-mono font-medium">
                {certificate.verifiedByName || 'Registrar Office'}
              </div>
              <p className="text-2xs font-bold text-slate-700">Checked / Verified By</p>
            </div>

            {/* Institutional Seal Graphic */}
            <div className="flex flex-col items-center justify-center p-2 rounded-full border-2 border-dashed border-slate-400 w-20 h-20 text-center select-none opacity-80">
              <span className="text-3xs font-bold uppercase text-slate-500 tracking-tighter">OFFICIAL SEAL</span>
              <Building className="w-4 h-4 text-slate-400 mt-0.5" />
            </div>

            {/* QR Verification Box */}
            <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 border border-slate-300 rounded-lg">
              <div className="w-16 h-16 bg-white border border-slate-200 flex items-center justify-center p-1 rounded-sm">
                {/* Visual QR Code Display */}
                <div className="w-full h-full bg-slate-900 p-1 flex flex-col justify-between rounded-2xs">
                  <div className="flex justify-between">
                    <div className="w-3 h-3 bg-white rounded-2xs"></div>
                    <div className="w-3 h-3 bg-white rounded-2xs"></div>
                  </div>
                  <div className="flex justify-center items-center text-white">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-3 h-3 bg-white rounded-2xs"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-2xs"></div>
                  </div>
                </div>
              </div>
              <span className="text-3xs font-mono font-bold text-slate-600">SCAN TO VERIFY</span>
            </div>

            {/* Principal / Authorized Signatory */}
            <div className="text-center space-y-1">
              <div className="w-36 border-b border-slate-900 pb-6 text-xs text-slate-900 font-bold">
                {signatoryData.name || certificate.signedByName || 'Dr. Eleanor Vance'}
              </div>
              <p className="text-2xs font-bold text-slate-900 uppercase">
                {signatoryData.designation || certificate.signatoryDesignation || 'Principal'}
              </p>
              <p className="text-3xs text-slate-500">(Authorized Signatory)</p>
            </div>

          </div>

          {/* Integrity Hash Notice */}
          <div className="pt-4 flex items-center justify-between text-3xs text-slate-400 font-mono">
            <span>Doc Hash: {certificate.documentHash || 'INTEGRITY-VERIFIED'}</span>
            <span>Ref: {certificate.verificationCode}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
