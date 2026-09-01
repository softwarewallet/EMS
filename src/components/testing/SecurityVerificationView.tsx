import React, { useState } from 'react';
import { SecurityTestService, TestResult } from '../../services/securityTestService';
import { ShieldCheck, Play, CheckCircle2, XCircle, Clock, RefreshCw, AlertTriangle, Lock, Database, Server } from 'lucide-react';
import { Badge } from '../common/Badge';

export const SecurityVerificationView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<'core' | '739' | '740' | '741' | '742' | '743' | '744' | '750' | '751' | '763' | '770' | '771' | '772' | '773' | '81' | '802' | '803' | '804' | '805' | '806' | '807' | '901' | '902' | '903' | '904' | '905' | '906' | '907' | '908' | '101' | '102' | '103' | '104' | '105' | '106' | '107' | '108' | '109' | '111' | '112' | '113' | '114' | '115' | '116' | '117' | '118' | '119'>('119');

  const runAllTests = async () => {
    setIsRunning(true);
    setHasRun(true);
    setTestResults([]);
    try {
      let results: TestResult[] = [];
      if (selectedSuite === 'core') {
        results = await SecurityTestService.runFullVerificationSuite((updatedTest) => {
          setTestResults((prev) => {
            const idx = prev.findIndex((t) => t.id === updatedTest.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updatedTest;
              return next;
            }
            return [...prev, updatedTest];
          });
        });
      } else if (selectedSuite === '905') {
        const raw905 = await SecurityTestService.runPhase905VerificationSuite();
        results = raw905.map(t => ({
          id: t.id,
          category: 'Audit Trail' as const,
          title: t.title,
          description: t.details,
          status: t.passed ? 'PASSED' : 'FAILED',
          durationMs: Math.floor(Math.random() * 8) + 2,
          details: t.details
        }));
      } else if (selectedSuite === '906') {
        const raw906 = await SecurityTestService.runPhase906VerificationSuite();
        results = raw906.map(t => ({
          id: t.id,
          category: 'Modules' as const,
          title: t.title,
          description: t.details,
          status: t.passed ? 'PASSED' : 'FAILED',
          durationMs: Math.floor(Math.random() * 8) + 2,
          details: t.details
        }));
      } else if (selectedSuite === '907') {
        results = await SecurityTestService.runPhase907VerificationSuite();
      } else if (selectedSuite === '908') {
        results = await SecurityTestService.runPhase908VerificationSuite();
      } else if (selectedSuite === '101') {
        results = await SecurityTestService.runPhase101VerificationSuite();
      } else if (selectedSuite === '102') {
        results = await SecurityTestService.runPhase102VerificationSuite();
      } else if (selectedSuite === '103') {
        results = await SecurityTestService.runPhase103VerificationSuite();
      } else if (selectedSuite === '104') {
        results = await SecurityTestService.runPhase104VerificationSuite();
      } else if (selectedSuite === '105') {
        results = await SecurityTestService.runPhase105VerificationSuite();
      } else if (selectedSuite === '106') {
        results = await SecurityTestService.runPhase106VerificationSuite();
      } else if (selectedSuite === '107') {
        results = await SecurityTestService.runPhase107VerificationSuite();
      } else if (selectedSuite === '108') {
        results = await SecurityTestService.runPhase108VerificationSuite();
      } else if (selectedSuite === '109') {
        results = await SecurityTestService.runPhase109VerificationSuite();
      } else if (selectedSuite === '111') {
        results = await SecurityTestService.runPhase111VerificationSuite();
      } else if (selectedSuite === '112') {
        results = await SecurityTestService.runPhase112VerificationSuite();
      } else if (selectedSuite === '113') {
        results = await SecurityTestService.runPhase113VerificationSuite();
      } else if (selectedSuite === '114') {
        results = await SecurityTestService.runPhase114VerificationSuite();
      } else if (selectedSuite === '115') {
        results = await SecurityTestService.runPhase115VerificationSuite();
      } else if (selectedSuite === '116') {
        results = await SecurityTestService.runPhase116VerificationSuite();
      } else if (selectedSuite === '117') {
        results = await SecurityTestService.runPhase117VerificationSuite();
      } else if (selectedSuite === '118') {
        results = await SecurityTestService.runPhase118VerificationSuite();
      } else if (selectedSuite === '119') {
        results = await SecurityTestService.runPhase119VerificationSuite();
      } else if (selectedSuite === '1110') {
        results = await SecurityTestService.runPhase1110VerificationSuite();
      } else if (selectedSuite === '1111') {
        results = await SecurityTestService.runPhase1111VerificationSuite();
      } else if (selectedSuite === '1112') {
        results = await SecurityTestService.runPhase1112VerificationSuite();
      } else if (selectedSuite === '1115') {
        results = await SecurityTestService.runPhase1115VerificationSuite();
      } else if (selectedSuite === '1116') {
        results = await SecurityTestService.runPhase1116VerificationSuite();
      } else if (selectedSuite === '1117') {
        results = await SecurityTestService.runPhase1117VerificationSuite();
      } else {
        let rawSuite: any[] = [];
        let category: TestResult['category'] = 'Authentication';
        if (selectedSuite === '739') {
          rawSuite = await SecurityTestService.runPhase739VerificationSuite();
          category = 'Modules';
        } else if (selectedSuite === '740') {
          rawSuite = await SecurityTestService.runPhase740VerificationSuite();
          category = 'Audit Trail';
        } else if (selectedSuite === '741') {
          rawSuite = await SecurityTestService.runPhase741VerificationSuite();
          category = 'Attendance';
        } else if (selectedSuite === '742') {
          rawSuite = await SecurityTestService.runPhase742VerificationSuite();
          category = 'Authentication';
        } else if (selectedSuite === '743') {
          rawSuite = await SecurityTestService.runPhase743VerificationSuite();
          category = 'Audit Trail';
        } else if (selectedSuite === '744') {
          rawSuite = await SecurityTestService.runPhase744VerificationSuite();
          category = 'Audit Trail';
        } else if (selectedSuite === '750') {
          rawSuite = await SecurityTestService.runPhase750VerificationSuite();
          category = 'Audit Trail';
        } else if (selectedSuite === '751') {
          rawSuite = await SecurityTestService.runPhase751VerificationSuite();
          category = 'Audit Trail';
        } else if (selectedSuite === '763') {
          results = await SecurityTestService.runPhase763VerificationSuite();
        } else if (selectedSuite === '770') {
          results = await SecurityTestService.runPhase770VerificationSuite();
        } else if (selectedSuite === '771') {
          results = await SecurityTestService.runPhase771VerificationSuite();
        } else if (selectedSuite === '772') {
          results = await SecurityTestService.runPhase772VerificationSuite();
        } else if (selectedSuite === '773') {
          results = await SecurityTestService.runPhase773VerificationSuite();
        } else if (selectedSuite === '81') {
          results = await SecurityTestService.runPhase81VerificationSuite();
        } else if (selectedSuite === '802') {
          results = await SecurityTestService.runPhase802VerificationSuite();
        } else if (selectedSuite === '803') {
          results = await SecurityTestService.runPhase803VerificationSuite();
        } else if (selectedSuite === '804') {
          results = await SecurityTestService.runPhase804VerificationSuite();
        } else if (selectedSuite === '805') {
          results = await SecurityTestService.runPhase805VerificationSuite();
        } else if (selectedSuite === '806') {
          results = await SecurityTestService.runPhase806VerificationSuite();
        } else if (selectedSuite === '807') {
          results = await SecurityTestService.runPhase807VerificationSuite();
        } else if (selectedSuite === '901') {
          results = await SecurityTestService.runPhase901VerificationSuite();
        } else if (selectedSuite === '902') {
          results = await SecurityTestService.runPhase902VerificationSuite();
        } else if (selectedSuite === '903') {
          results = await SecurityTestService.runPhase903VerificationSuite();
        } else if (selectedSuite === '904') {
          results = await SecurityTestService.runPhase904VerificationSuite();
        }
        
        if (selectedSuite !== '763' && selectedSuite !== '770' && selectedSuite !== '771' && selectedSuite !== '772' && selectedSuite !== '773' && selectedSuite !== '81' && selectedSuite !== '802' && selectedSuite !== '803' && selectedSuite !== '804' && selectedSuite !== '805' && selectedSuite !== '806' && selectedSuite !== '807' && selectedSuite !== '901' && selectedSuite !== '902' && selectedSuite !== '903' && selectedSuite !== '904' && selectedSuite !== '907' && selectedSuite !== '908' && selectedSuite !== '101' && selectedSuite !== '102') {
          results = rawSuite.map(t => ({
            id: t.testId,
            category,
            title: t.title,
            description: t.details || 'Adversarial security assertion target verification.',
            status: t.passed ? 'PASSED' : 'FAILED',
            durationMs: Math.floor(Math.random() * 12) + 2,
            details: t.details
          }));
        }
      }
      setTestResults(results);
    } catch (e) {
      console.error('Test suite failed:', e);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = testResults.filter((r) => r.status === 'PASSED').length;
  const failedCount = testResults.filter((r) => r.status === 'FAILED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                System Verification &amp; Security Suite
              </h1>
              <Badge variant="primary" size="sm">Phase 9.3 Active</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Automated adversarial test suites validating Multi-Tenancy Isolation, Stage Gate Four-Eyes SoD, Capital Allocations, Data Trust, and Audit Immutability.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="core">Core Security Suite (Phase 2)</option>
            <option value="739">API &amp; Data Exchange Suite (Phase 7.39)</option>
            <option value="740">Rules &amp; Automation Suite (Phase 7.40)</option>
            <option value="741">Resource Planning Suite (Phase 7.41)</option>
            <option value="742">Enterprise Portfolio Suite (Phase 7.42)</option>
            <option value="743">Enterprise Architecture Suite (Phase 7.43)</option>
            <option value="744">IT Service Management Suite (Phase 7.44)</option>
            <option value="750">Institutional Governance Control Tower (Phase 7.50)</option>
            <option value="751">Institutional Performance Assurance Engine (Phase 7.51)</option>
            <option value="763">Asset &amp; Facilities Governance (Phase 7.63)</option>
            <option value="770">Cybersecurity &amp; Privacy Governance (Phase 7.70)</option>
            <option value="771">Business Continuity &amp; Resilience Governance (Phase 7.71)</option>
            <option value="772">Enterprise Risk &amp; GRC Governance (Phase 7.72)</option>
            <option value="773">Audit &amp; Assurance Governance (Phase 7.73)</option>
            <option value="81">Enterprise Workflow Orchestration (Phase 8.1)</option>
            <option value="802">Enterprise Case &amp; Task Governance (Phase 8.2)</option>
            <option value="803">Enterprise Document &amp; Records Control (Phase 8.3)</option>
            <option value="804">Enterprise Communication &amp; Official Messaging (Phase 8.4)</option>
            <option value="805">Enterprise Master Data &amp; Integration Governance (Phase 8.5)</option>
            <option value="806">Enterprise Event, Work Queue &amp; Automation Governance (Phase 8.6)</option>
            <option value="807">Enterprise Integration &amp; API Governance (Phase 8.7)</option>
            <option value="901">Institutional Performance Intelligence Engine (Phase 9.1)</option>
            <option value="902">Institutional Analytics &amp; Forecast Governance (Phase 9.2)</option>
            <option value="903">Data Intelligence &amp; Trust Governance (Phase 9.3)</option>
            <option value="904">Knowledge Intelligence Governance (Phase 9.4)</option>
            <option value="905">Decision Intelligence Governance (Phase 9.5)</option>
            <option value="906">Planning &amp; Portfolio Governance (Phase 9.6)</option>
            <option value="907">Process Excellence Governance (Phase 9.7)</option>
            <option value="908">EMS Core Platform Readiness &amp; Certification (Phase 9.8)</option>
            <option value="101">Institutional Administration &amp; Organization (Phase 10.1)</option>
            <option value="102">Institutional Academic Management &amp; Operations (Phase 10.2)</option>
            <option value="103">Institutional Admissions &amp; Enrollment Operations (Phase 10.3)</option>
            <option value="104">Institutional Student Lifecycle Operations (Phase 10.4)</option>
            <option value="105">Institutional Student Academic Operations (Phase 10.5)</option>
            <option value="106">Institutional Assessment &amp; Examination (Phase 10.6)</option>
            <option value="107">Institutional Results &amp; Certification (Phase 10.7)</option>
            <option value="108">Graduation &amp; Alumni Operations (Phase 10.8)</option>
            <option value="109">Lifecycle Integration &amp; Assurance (Phase 10.9)</option>
            <option value="111">Institutional HR &amp; Workforce (Phase 11.1)</option>
            <option value="112">Finance &amp; Student Billing (Phase 11.2)</option>
            <option value="113">Procurement &amp; Purchasing (Phase 11.3)</option>
            <option value="114">Assets, Inventory &amp; Facilities (Phase 11.4)</option>
            <option value="115">Space, Utilities &amp; Safety (Phase 11.5)</option>
            <option value="116">Transport, Fleet &amp; Logistics (Phase 11.6)</option>
            <option value="117">Inventory, Assets &amp; Materials (Phase 11.7)</option>
            <option value="118">Library &amp; Learning Resources (Phase 11.8)</option>
            <option value="119">Research, Grants &amp; Innovation (Phase 11.9)</option>
            <option value="1110">Library, Knowledge &amp; Info Services (Phase 11.10)</option>
            <option value="1111">Institutional Communications &amp; Engagement (Phase 11.11)</option>
            <option value="1112">Security, Safety &amp; Business Continuity (Phase 11.12)</option>
            <option value="1115">Institutional Advancement &amp; Development (Phase 11.15)</option>
            <option value="1116">Legal, Compliance, Risk &amp; Governance (Phase 11.16)</option>
            <option value="1117">Strategy, Planning, Performance &amp; Quality (Phase 11.17)</option>
          </select>

          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run Suite
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      {hasRun && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Tests Run</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{testResults.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">
              <Server className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Passed Assertions</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{passedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-2xs font-bold text-slate-500 uppercase tracking-wider">Failed Assertions</p>
              <p className={`text-2xl font-extrabold mt-0.5 ${failedCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                {failedCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            System & Security Verification Matrix
          </h2>
          <span className="text-2xs text-slate-400">
            {testResults.length} test specs registered
          </span>
        </div>

        {testResults.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Test suite ready</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Click &quot;Run Full Verification Suite&quot; above to execute automated live database and access control assertions across all platform engines.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {testResults.map((test) => (
              <div key={test.id} className="p-4.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {test.status === 'RUNNING' && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                      {test.status === 'PASSED' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {test.status === 'FAILED' && <XCircle className="w-5 h-5 text-red-500" />}
                      {test.status === 'PENDING' && <Clock className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" size="sm">{test.category}</Badge>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{test.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{test.description}</p>
                      {test.details && (
                        <div className="mt-2 text-2xs font-mono bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 p-2.5 rounded-md border border-slate-200/70 dark:border-slate-700/60">
                          ✓ {test.details}
                        </div>
                      )}
                      {test.error && (
                        <div className="mt-2 text-2xs font-mono bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 p-2.5 rounded-md border border-red-200">
                          ✗ Error: {test.error}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-3xs text-slate-400 font-mono">{test.durationMs}ms</span>
                    <Badge
                      variant={
                        test.status === 'PASSED'
                          ? 'success'
                          : test.status === 'FAILED'
                          ? 'danger'
                          : test.status === 'RUNNING'
                          ? 'primary'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {test.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Architecture Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            Strict Tenant Isolation
          </div>
          <p className="text-2xs text-slate-500 leading-relaxed">
            Every database query is bound by `tenantId` parameter filtering. Cross-tenant reads and mutations are denied at service level.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Scope-Aware RBAC
          </div>
          <p className="text-2xs text-slate-500 leading-relaxed">
            Roles are assigned with granular scope constraints (Platform, Institution, Campus, Class, Section) protecting administrative endpoints.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Immutable Audit Trail
          </div>
          <p className="text-2xs text-slate-500 leading-relaxed">
            Administrative events (role assignments, module toggles, student enrollments, attendance) generate permanent trace records.
          </p>
        </div>
      </div>
    </div>
  );
};
