import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  FileText, 
  Building, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { CertificateService } from '../../services/certificateService';
import { CertificateVerificationResult } from '../../types';

interface PublicCertificateVerificationViewProps {
  initialVerificationCode?: string;
}

export const PublicCertificateVerificationView: React.FC<PublicCertificateVerificationViewProps> = ({
  initialVerificationCode
}) => {
  const [code, setCode] = useState(initialVerificationCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await CertificateService.publicVerifyCertificate(codeToVerify.trim());
      setResult(res);
    } catch (err) {
      console.error('Verification query failed:', err);
      setResult({
        certificateNumber: 'ERROR',
        status: 'INVALID',
        documentType: 'UNKNOWN',
        institutionName: 'Error',
        studentNameMasked: '***',
        admissionNumberMasked: '***',
        verificationTimestamp: new Date().toISOString(),
        isValid: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialVerificationCode) {
      setCode(initialVerificationCode);
      handleVerify(initialVerificationCode);
    }
  }, [initialVerificationCode]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 px-4">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Official Document Verification Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Verify the authenticity and current validity of institutional Transfer Certificates and School Leaving Certificates issued by affiliated schools.
        </p>
      </div>

      {/* Verification Code Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-3">
        <label className="block text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Enter Verification Token or Scan QR
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. VRF-XXXX-XXXX-XXXX"
              className="w-full pl-9 pr-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify(code)}
            />
          </div>
          <button
            onClick={() => handleVerify(code)}
            disabled={isLoading || !code.trim()}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>
      </div>

      {/* Result Card */}
      {hasSearched && result && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Status Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {result.status === 'VALID' ? (
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : result.status === 'REISSUED' ? (
                <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
                  <RotateCcw className="w-7 h-7" />
                </div>
              ) : (
                <div className="p-2.5 bg-rose-500/10 text-rose-600 rounded-2xl">
                  <XCircle className="w-7 h-7" />
                </div>
              )}
              <div>
                <span className={`text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                  result.status === 'VALID' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                  result.status === 'REISSUED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                }`}>
                  DOCUMENT STATUS: {result.status}
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {result.status === 'VALID' ? 'Authentic Document of Record' :
                   result.status === 'REISSUED' ? 'Superseded (Reissued Document)' :
                   'Invalid or Revoked Certificate'}
                </h2>
              </div>
            </div>
          </div>

          {/* Details Table (Strict Data Protection - Minimal Safe Info Only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Certificate Number</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{result.certificateNumber}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Document Type</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{result.documentType}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Issuing Institution</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{result.institutionName}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Pupil Name (Masked for Privacy)</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{result.studentNameMasked}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Admission No. (Masked)</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{result.admissionNumberMasked}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-0.5">
              <span className="text-2xs text-slate-400 font-semibold uppercase">Date of Issue</span>
              <p className="font-bold text-slate-900 dark:text-slate-100">{result.issueDate || 'N/A'}</p>
            </div>
          </div>

          {/* Status-specific banners */}
          {result.status === 'REISSUED' && result.reissuedCertificateNumber && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold">Superseded by Reissue</p>
              <p className="text-2xs mt-0.5">
                This document was formally reissued by the institution. Current valid document certificate number: <strong>{result.reissuedCertificateNumber}</strong>.
              </p>
            </div>
          )}

          {result.status === 'CANCELLED' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs text-rose-800 dark:text-rose-300">
              <p className="font-bold">Document Revoked / Cancelled</p>
              <p className="text-2xs mt-0.5">
                Reason recorded on file: {result.cancellationReason || 'Cancelled by Institutional Administration'}.
              </p>
            </div>
          )}

          {/* Footer Security Notice */}
          <div className="pt-2 text-center text-3xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            Verified at {new Date(result.verificationTimestamp).toLocaleString()} UTC. In accordance with student privacy protection standards, sensitive personal and guardian information is masked.
          </div>

        </div>
      )}
    </div>
  );
};
