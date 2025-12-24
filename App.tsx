
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Languages, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Globe,
  Youtube,
  Zap,
  TrendingUp,
  FileArchive,
  Crown,
  DollarSign,
  ChevronRight,
  Target,
  Filter,
  X,
  Trash2,
  CheckSquare
} from 'lucide-react';
import JSZip from 'jszip';
import { COUNTRIES } from './constants';
import { GenerationState, InputMode, GeneratedContent } from './types';
import { GeminiService } from './services/geminiService';
import { convertToSrt } from './utils/srtHelper';

const BATCH_LIMIT = 20;

const motivationMessages = [
  "Sabar dulu ya mas bro/sis, proses sedang berjalan dengan lancar...",
  "Sedang generate subtitle untuk negara pilihanmu...",
  "Tunggu sebentar ya, hasilnya worth it kok! 💰",
  "Proses translate sedang berjalan, sabar ya...",
  "Sedang packaging ke ZIP file, hampir selesai nih!",
  "Hasilnya bakal keren banget, sabar ya bro/sis! 🚀",
  "Tungguin progressnya, lagi dirapihin nih subtitlenya...",
  "Sedang optimize untuk RPM tinggi, sabar dulu ya...",
  "Proses terakhir, lagi bikin report lengkap nih!",
  "Sebentar lagi selesai, hasilnya bakal memuaskan! ✅"
];

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['usa', 'germany', 'japan']);
  const [masterTitle, setMasterTitle] = useState('');
  const [masterDesc, setMasterDesc] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [motivationIndex, setMotivationIndex] = useState(0);
  
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    status: '',
    error: null,
    results: null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (state.isGenerating) {
      interval = setInterval(() => {
        setMotivationIndex(prev => (prev + 1) % motivationMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [state.isGenerating]);

  const stats = useMemo(() => {
    const selected = COUNTRIES.filter(c => selectedCountries.includes(c.id));
    const count = selected.length;
    const avgRpm = count > 0 ? selected.reduce((acc, curr) => acc + curr.rpmValue, 0) / count : 0;
    const estRev = selected.reduce((acc, curr) => acc + (curr.rpmValue * 10), 0);
    const procTime = count * 1.5;
    return { count, avgRpm, estRev, procTime };
  }, [selectedCountries]);

  const toggleCountry = (id: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 3) return prev; 
        return prev.filter(c => c !== id);
      }
      if (prev.length >= BATCH_LIMIT) return prev;
      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (selectedCountries.length === COUNTRIES.length) {
      setSelectedCountries(['usa', 'germany', 'japan']);
    } else {
      setSelectedCountries(COUNTRIES.map(c => c.id).slice(0, BATCH_LIMIT));
    }
  };

  const selectByTier = (tier: string) => {
    const tierIds = COUNTRIES.filter(c => c.tier === tier).map(c => c.id);
    setSelectedCountries(prev => Array.from(new Set([...prev, ...tierIds])).slice(0, BATCH_LIMIT));
  };

  const clearAll = () => setSelectedCountries(['usa', 'germany', 'japan']);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const runGenerator = async () => {
    setShowConfirm(false);
    setState({
      isGenerating: true,
      progress: 0,
      status: '📁 Menganalisis File Upload...',
      error: null,
      results: null
    });

    try {
      const gemini = new GeminiService();
      const targetList = COUNTRIES.filter(c => selectedCountries.includes(c.id))
        .map(c => ({ name: c.name, language: c.language }));

      let fileData;
      if (inputMode === 'file' && file) {
        setState(s => ({ ...s, progress: 15, status: '🌍 Menghubungkan ke Mesin Penerjemah Global...' }));
        const base64 = await readFileAsBase64(file);
        fileData = { data: base64, mimeType: file.type };
      } else {
        setState(s => ({ ...s, progress: 15, status: '🌍 Memproses Script Manual...' }));
      }

      setState(s => ({ ...s, progress: 40, status: '✏️ Menghasilkan Subtitle & Optimasi SEO...' }));
      
      const results = await gemini.generateAllContent(
        inputMode === 'script' ? scriptText : 'Analyze media stream and generate assets.',
        masterTitle,
        masterDesc,
        targetList,
        fileData
      );

      setState(s => ({ ...s, progress: 85, status: '📦 Mempersiapkan Paket ZIP (BY ROHMANUDIN05)...' }));
      await new Promise(r => setTimeout(r, 1500));

      setState({
        isGenerating: false,
        progress: 100,
        status: '✅ Selesai!',
        error: null,
        results
      });
    } catch (error: any) {
      setState({
        isGenerating: false,
        progress: 0,
        status: '',
        error: error.message || 'Gagal melakukan generasi. Coba lagi nanti.',
        results: null
      });
    }
  };

  const downloadAllAsZip = async () => {
    if (!state.results) return;
    const zip = new JSZip();
    const folder = zip.folder("SUBTITLE_PACK_ROHMANUDIN05");
    
    state.results.forEach((content) => {
      const cFolder = folder?.folder(content.country.toUpperCase());
      cFolder?.file(`${content.country}_subtitles.srt`, convertToSrt(content.subtitles));
      
      const seoData = `=== BRANDING: BY ROHMANUDIN05 ===
NEGARA: ${content.country}
BAHASA: ${content.language}

--- JUDUL TEROPTIMASI (3 VARIASI) ---
${content.titles.map((t, i) => `${i+1}. ${t}`).join('\n')}

--- DESKRIPSI SEO ---
${content.description}

Generated with BY ROHMANUDIN05 AI System.`;
      
      cFolder?.file(`${content.country}_SEO_PACK.txt`, seoData);
    });

    const report = `=== BY ROHMANUDIN05 STRATEGIC REPORT ===
Generated: ${new Date().toLocaleString()}
Countries: ${selectedCountries.length}
Average RPM: $${stats.avgRpm.toFixed(2)}
Estimated Revenue: $${stats.estRev.toFixed(2)}/10k views`;
    folder?.file(`REPORT_SUMMARY.txt`, report);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BY_ROHMANUDIN05_PACK_${Date.now()}.zip`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Premium Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-blue-700 to-purple-600 p-2 rounded-xl shadow-xl shadow-blue-500/20">
              <Languages className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter uppercase leading-none bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BY ROHMANUDIN05</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 italic">High RPM Subtitle Mastery</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20">REAL ZIP EXPORT</span>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/20">NO API REQUIRED</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 md:p-10 space-y-12 pb-32">
        {!state.results ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Unified Input */}
              <div className="lg:col-span-7 space-y-8">
                <section className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 w-1.5 h-8 rounded-full"></div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Step 1: Unified Input</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                      onClick={() => setInputMode('file')}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${inputMode === 'file' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                    >
                      <Upload className="w-5 h-5" /> Media File
                    </button>
                    <button 
                      onClick={() => setInputMode('script')}
                      className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all border-2 ${inputMode === 'script' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                    >
                      <FileText className="w-5 h-5" /> Manual Script
                    </button>
                  </div>

                  {inputMode === 'file' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 bg-slate-950/50 rounded-3xl p-16 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                    >
                      <div className="bg-slate-800 p-6 rounded-full">
                        <Upload className="w-10 h-10 text-slate-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-slate-300">
                          {file ? <span className="text-blue-400">{file.name}</span> : 'Upload Video/Audio'}
                        </p>
                        <p className="text-xs text-slate-600 font-bold uppercase mt-2 tracking-widest">Auto-Transcribe Layer Active</p>
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                    </div>
                  ) : (
                    <textarea 
                      placeholder="Tempel script master atau naskah Anda di sini..."
                      value={scriptText}
                      onChange={(e) => setScriptText(e.target.value)}
                      className="w-full h-64 p-8 bg-slate-950/50 border-2 border-slate-800 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none text-slate-200 placeholder:text-slate-700 resize-none font-medium"
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Title Source</label>
                      <input 
                        type="text" 
                        value={masterTitle}
                        onChange={(e) => setMasterTitle(e.target.value)}
                        placeholder="Judul asli video..."
                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Description Source</label>
                      <input 
                        type="text" 
                        value={masterDesc}
                        onChange={(e) => setMasterDesc(e.target.value)}
                        placeholder="Konteks untuk optimasi SEO..."
                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Targeting Panel */}
              <div className="lg:col-span-5 space-y-8">
                <section className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl relative">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-600 w-1.5 h-8 rounded-full"></div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Step 2: Market Targeting</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Selected</span>
                      <p className="text-lg font-black text-blue-400">{selectedCountries.length}/{BATCH_LIMIT}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="peer hidden" 
                            checked={selectedCountries.length >= BATCH_LIMIT}
                            onChange={toggleSelectAll}
                          />
                          <div className="w-6 h-6 border-2 border-slate-700 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                            {selectedCountries.length >= BATCH_LIMIT && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Select All (Max 20)</span>
                      </label>
                      <button onClick={clearAll} className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => selectByTier('S')} className="text-[9px] font-black uppercase p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700 flex items-center justify-center gap-2"><Crown className="w-3 h-3 text-amber-500" /> Tier S</button>
                      <button onClick={() => selectByTier('A')} className="text-[9px] font-black uppercase p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700 flex items-center justify-center gap-2"><DollarSign className="w-3 h-3 text-green-500" /> Tier A</button>
                      <button onClick={() => setSelectedCountries(COUNTRIES.filter(c => c.continent === 'Europe').map(c => c.id).slice(0, 20))} className="text-[9px] font-black uppercase p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700 flex items-center justify-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Europe</button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[350px] pr-4 space-y-2 custom-scrollbar">
                    {COUNTRIES.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => toggleCountry(c.id)}
                        className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          selectedCountries.includes(c.id) 
                            ? 'border-blue-600 bg-blue-600/10' 
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">
                            {c.code.split('').map(char => String.fromCodePoint(char.charCodeAt(0) + 127397)).join('')}
                          </span>
                          <div>
                            <p className="text-sm font-black text-slate-100">{c.name}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase mt-0.5">{c.estimatedRpm} RPM • {c.tier} TIER</p>
                          </div>
                        </div>
                        {selectedCountries.includes(c.id) && <CheckSquare className="w-5 h-5 text-blue-500" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-slate-950 p-6 rounded-3xl border border-slate-800 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg RPM</p>
                      <p className="text-2xl font-black text-green-500">${stats.avgRpm.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact Est.</p>
                      <p className="text-2xl font-black text-blue-500">${stats.estRev.toFixed(0)} <span className="text-[10px] text-slate-700">/ 10k views</span></p>
                    </div>
                  </div>

                  <button 
                    disabled={state.isGenerating || selectedCountries.length < 3}
                    onClick={() => setShowConfirm(true)}
                    className="mt-6 w-full py-6 bg-gradient-to-r from-blue-700 to-purple-600 hover:from-blue-600 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
                  >
                    <Zap className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
                    GENERATE SYSTEM 3-IN-1
                  </button>
                </section>
              </div>
            </div>
            
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
              <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-800">
                <Target className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="font-black uppercase text-sm tracking-widest text-slate-100 mb-2">Layer 1: Analysis</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Internal scan of local niche metrics, high-RPM keyword benchmarking, and cultural trend pulling.</p>
              </div>
              <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-800">
                <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className="font-black uppercase text-sm tracking-widest text-slate-100 mb-2">Layer 2: Content</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">3 Title variations & SEO descriptions optimized for maximum global visibility and RPM performance.</p>
              </div>
              <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-800">
                <Youtube className="w-8 h-8 text-green-400 mb-4" />
                <h4 className="font-black uppercase text-sm tracking-widest text-slate-100 mb-2">Layer 3: Delivery</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Precise SRT timecode syncing with mandatory BY ROHMANUDIN05 credit line at the 0:45 mark.</p>
              </div>
            </section>
          </>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000 text-center">
            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden flex flex-col items-center gap-10">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-center gap-5">
                  <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-6xl font-black tracking-tighter leading-none">PAKET SIAP!</h2>
                </div>
                <p className="text-blue-100 text-2xl font-medium max-w-2xl opacity-90 leading-relaxed mx-auto">
                  Paket konten multi-bahasa BY ROHMANUDIN05 untuk {state.results.length} negara sudah selesai. SRT, Judul, dan SEO Deskripsi telah teroptimasi.
                </p>
              </div>

              <button 
                onClick={downloadAllAsZip}
                className="relative z-10 flex items-center gap-5 px-16 py-8 bg-white text-blue-900 rounded-[2.5rem] font-black text-3xl hover:bg-blue-50 transition-all shadow-3xl active:scale-95 group"
              >
                <FileArchive className="w-10 h-10 group-hover:rotate-12 transition-transform" />
                DOWNLOAD ZIP PACK
              </button>
            </div>

            <button 
              onClick={() => setState(s => ({ ...s, results: null }))}
              className="px-12 py-5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 font-black rounded-full transition-all uppercase text-sm tracking-[0.3em] hover:border-slate-600"
            >
              ← ULANGI PROSES BARU
            </button>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 max-w-2xl w-full shadow-4xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Konfirmasi Generasi</h2>
                <p className="text-slate-500 font-medium">Memproses {stats.count} negara dengan logika BY ROHMANUDIN05.</p>
              </div>
              <button onClick={() => setShowConfirm(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <div className="bg-slate-950 rounded-3xl p-6 mb-8 border border-slate-800 space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
              {COUNTRIES.filter(c => selectedCountries.includes(c.id)).map(c => (
                <div key={c.id} className="flex items-center justify-between py-3 border-b border-slate-900 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.code.split('').map(char => String.fromCodePoint(char.charCodeAt(0) + 127397)).join('')}</span>
                    <span className="font-bold text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-xs font-black text-green-500 uppercase tracking-widest">{c.estimatedRpm} RPM</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10 text-center">
              <div className="p-5 bg-slate-800/30 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimasi Waktu</p>
                <p className="text-xl font-black text-blue-400">~{stats.procTime.toFixed(1)} Min</p>
              </div>
              <div className="p-5 bg-slate-800/30 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sistem Output</p>
                <p className="text-xl font-black text-green-400">ZIP 3-IN-1</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black rounded-[1.5rem] hover:bg-slate-700 transition-all uppercase">Batal</button>
              <button onClick={runGenerator} className="flex-2 py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-500 shadow-xl shadow-blue-900/20 transition-all uppercase px-12">Mulai Generasi</button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Overlay (BY ROHMANUDIN05 Style) */}
      {state.isGenerating && (
        <div className="fixed inset-0 z-[110] bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-slate-900/50 border-2 border-blue-600/50 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] space-y-10">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase flex items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              SEDANG PROSES GENERATE
            </h2>
            
            <div className="bg-blue-600/10 border-l-4 border-blue-600 rounded-2xl p-6 text-xl font-medium italic text-slate-400 animate-pulse">
              "{motivationMessages[motivationIndex]}"
            </div>
            
            <div className="space-y-4">
              <p className="text-6xl font-black text-blue-500 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">{state.progress}%</p>
              <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden p-1 border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-green-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{state.status}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 text-[10px] font-black uppercase text-slate-600">
              <div className={state.progress >= 20 ? 'text-blue-400' : ''}>📁 Input</div>
              <div className={state.progress >= 40 ? 'text-blue-400' : ''}>🌍 Translate</div>
              <div className={state.progress >= 60 ? 'text-blue-400' : ''}>✏️ Subtitle</div>
              <div className={state.progress >= 85 ? 'text-blue-400' : ''}>📦 ZIP Pack</div>
              <div className={state.progress >= 100 ? 'text-blue-400' : ''}>✅ Done</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h3 className="font-black text-2xl text-white tracking-tighter uppercase">BY ROHMANUDIN05</h3>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
            🔥 <strong>Powered by ROHMANUDIN05</strong> | High RPM Optimization System | 100% No API Required
          </p>
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.6em]">
            © {new Date().getFullYear()} ROHMANUDIN05 AI SYSTEMS • CORE V2.5
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}} />
    </div>
  );
};

export default App;
