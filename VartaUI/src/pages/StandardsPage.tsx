import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Search, 
  Scale 
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const StandardsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0B131D] text-slate-900 dark:text-[#FDF9F2] flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 py-10 sm:py-14">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to dispatches</span>
        </button>

        {/* Page Header */}
        <div className="mb-12 border-b border-[#EAE5DC] dark:border-[#2A3848] pb-8">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Integrity, Verification & Ethics</span>
          </div>
          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
            Journalistic Standards & Editorial Principles
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl">
            Varta is committed to reporting verified evidence of human progress, scientific breakthroughs, and societal resilience with uncompromising journalistic rigour.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* 1. Positivity Scoring Heuristics */}
          <section id="heuristics" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-slate-900 dark:text-white">
                  Positivity Scoring Heuristics
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Algorithmic and editorial evaluation of constructive impact
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Every dispatch on Varta is assigned a verified Positivity Score ranging from 60% to 100%. Unlike shallow feel-good trivia, our score evaluates systemic impact, repeatability, and factual authenticity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#111A24] border border-stone-200 dark:border-[#2A3848]">
                <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">90% - 100%: Historic Leaps</strong>
                <p className="text-slate-500 dark:text-slate-400">Global medical cures, landmark climate accords, and widespread structural solutions.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#111A24] border border-stone-200 dark:border-[#2A3848]">
                <strong className="text-amber-700 dark:text-amber-400 block mb-1">75% - 89%: Progress Milestones</strong>
                <p className="text-slate-500 dark:text-slate-400">Municipal achievements, innovative clean tech deployments, and regional recoveries.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#111A24] border border-stone-200 dark:border-[#2A3848]">
                <strong className="text-blue-700 dark:text-blue-400 block mb-1">60% - 74%: Grassroots Hope</strong>
                <p className="text-slate-500 dark:text-slate-400">Individual acts of courage, community altruism, and heroic everyday kindness.</p>
              </div>
            </div>
          </section>

          {/* 2. Verified Source Attribution */}
          <section id="sources" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-slate-900 dark:text-white">
                  Verified Source Attribution
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct primary evidence and authoritative citations
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              We never report rumor, hearsay, or uncorroborated press releases. Every article links directly to primary sources:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Peer-reviewed scientific journals (Nature, Science, The Lancet, Cell).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct government or municipal registries, patents, and official legal filings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Accredited independent news bureaus and on-the-ground investigative reporters.</span>
              </li>
            </ul>
          </section>

          {/* 3. Editorial Review Guidelines */}
          <section id="editorial" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-700/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-slate-900 dark:text-white">
                  Editorial Review Guidelines
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Multi-tier fact-checking and objective constructive journalism
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Constructive journalism is not "toxic positivity" or ignoring real problems. Rather, it focuses on the solutions, remedies, and human perseverance that address those problems.
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p>
                <strong>The 3-Question Test:</strong> Before any dispatch is published, editors verify:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 text-slate-500 dark:text-slate-400">
                <li>Is the breakthrough real, active, and verified by credible third parties?</li>
                <li>Does this story illuminate how a difficult obstacle was solved?</li>
                <li>Can other communities or individuals replicate or learn from this progress?</li>
              </ol>
            </div>
          </section>

          {/* 4. Privacy & Data Governance */}
          <section id="privacy" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-[#FFFDF9] dark:bg-[#16202B] border border-[#EAE5DC] dark:border-[#2A3848] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-editorial text-2xl font-bold text-slate-900 dark:text-white">
                  Privacy & Data Governance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Zero tracking, complete reader ownership, and instant deletion
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              We respect your peace of mind and your digital sovereignty. Varta does not sell reader data, does not install cross-site advertising trackers, and provides immediate one-click deletion of your profile and reading history.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/preferences"
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-colors"
              >
                Manage Preferences
              </Link>
              <Link
                to="/delete-account"
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors"
              >
                Account Deletion & Data Wipe
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};
