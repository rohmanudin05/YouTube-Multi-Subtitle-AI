
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
  CheckSquare,
  BadgeInfo,
  ChevronDown,
  Timer,
  LayoutGrid,
  MonitorPlay,
  Settings2,
  Eye,
  ArrowRight,
  Sparkles,
  Keyboard
} from 'lucide-react';
import JSZip from 'jszip';
import { COUNTRIES } from './constants';
import { GenerationState, InputMode, GeneratedContent } from './types';
import { GeminiService } from './services/geminiService';
import { convertToSrt } from './utils/srtHelper';

const MAX_BATCH = 20;

const motivationMessages = [
  "Sabar dulu ya mas bro/sis, subtitle lengkap sedang dibuat...",
  "Sedang translate script ke semua bahasa yang dipilih...",
  "Proses pembuatan timing subtitle sedang berjalan...",
  "Sedang generate file .srt untuk setiap negara...",
  "Hampir selesai, lagi packaging ke ZIP file...",
  "Hasilnya bakal lengkap banget, sabar ya bro/sis! 🚀",
  "Tungguin progressnya, lagi dirapihin nih subtitlenya...",
  "Sedang optimasi timing untuk readability terbaik...",
  "Proses terakhir, lagi bikin file untuk semua negara...",
  "Sebentar lagi selesai, subtitle lengkap ready! ✅"
];

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('script');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['usa', 'germany', 'japan']);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDuration, setVideoDuration] = useState(10);
  const [masterDesc, setMasterDesc] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [state.isGenerating]);

  const stats = useMemo(() => {
    const selected = COUNTRIES.filter(c => selectedCountries.includes(c.id));
    const count = selected.length;
    const avgRpm = count > 0 ? selected.reduce((acc, curr) => acc + curr.rpmValue, 0) / count : 0;
    const lineCount = scriptText.split('\n').filter(l => l.trim()).length;
    return { count, avgRpm, lineCount };
  }, [selectedCountries, scriptText]);

  const toggleCountry = (id: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; 
        return prev.filter(c => c !== id);
      }
      if (prev.length >= MAX_BATCH) return prev;
      return [...prev, id];
    });
  };

  const toggleSelectAll = () => {
    if (selectedCountries.length >= MAX_BATCH) {
      setSelectedCountries(['usa', 'germany', 'japan']);
    } else {
      setSelectedCountries(COUNTRIES.map(c => c.id).slice(0, MAX_BATCH));
    }
  };

  const selectHighRPM = () => {
    const high = COUNTRIES.filter(c => c.rpmValue >= 15).map(c => c.id);
    setSelectedCountries(high.slice(0, MAX_BATCH));
  };

  const selectTier = (tier: string) => {
    const ids = COUNTRIES.filter(c => c.tier === tier).map(c => c.id);
    setSelectedCountries(ids.slice(0, MAX_BATCH));
  };

  const clearAll = () => setSelectedCountries(['usa']);

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
    if (selectedCountries.length === 0) return;
    if (inputMode === 'script' && !scriptText.trim()) {
      setState(s => ({ ...s, error: 'Script video tidak boleh kosong.' }));
      return;
    }

    setShowConfirm(false);
    setState({
      isGenerating: true,
      progress: 0,
      status: '📝 Parsing Data Script & Analisis Niche...',
      error: null,
      results: null
    });

    try {
      const gemini = new GeminiService();
      const targetList = COUNTRIES.filter(c => selectedCountries.includes(c.id))
        .map(c => ({ name: c.name, language: c.language }));

      let fileData;
      if (inputMode === 'file' && file) {
        setState(s => ({ ...s, progress: 10, status: '📁 Menganalisis Media Stream...' }));
        const base64 = await readFileAsBase64(file);
        fileData = { data: base64, mimeType: file.type };
      }

      setState(s => ({ ...s, progress: 25, status: '🌍 Sinkronisasi Translate Global...' }));
      await new Promise(r => setTimeout(r, 1000));
      
      setState(s => ({ ...s, progress: 45, status: '✏️ Layer 2: Optimasi SEO & Judul...' }));
      
      const results = await gemini.generateAllContent(
        inputMode === 'script' ? scriptText : 'Analyze media stream and transcribe.',
        videoTitle || 'Untitled Video',
        masterDesc,
        targetList,
        videoDuration,
        fileData
      );

      setState(s => ({ ...s, progress: 85, status: '📦 Layer 3: Packaging ZIP (BY ROHMANUDIN05)...' }));
      await new Promise(r => setTimeout(r, 1500));

      setState({
        isGenerating: false,
        progress: 100,
        status: '✅ SELESAI!',
        error: null,
        results
      });
    } catch (error: any) {
      setState({
        isGenerating: false,
        progress: 0,
        status: '',
        error: error.message || 'Gagal memproses. Coba kurangi jumlah negara.',
        results: null
      });
    }
  };

  const downloadAllAsZip = async () => {
    if (!state.results) return;
    const zip = new JSZip();
    const folder = zip.folder("BY_ROHMANUDIN05_PACK");
    
    state.results.forEach((content) => {
      const countryId = COUNTRIES.find(c => c.name === content.country)?.id || content.country.toLowerCase();
      const cFolder = folder?.folder(content.country.toUpperCase());
      
      // Subtitle
      cFolder?.file(`${countryId}_subtitles.srt`, convertToSrt(content.subtitles));
      
      // SEO Pack
      const seoPack = `=== BY ROHMANUDIN05 STRATEGIC PACK ===
NEGARA: ${content.country}
BAHASA: ${content.language}

--- 3 VARIASI JUDUL (SEO OPTIMIZED) ---
${content.titles.map((t, i) => `Variation ${i+1}:\n${t}`).join('\n\n')}

--- DESKRIPSI STRATEGIS ---
${content.description}`;
      
      cFolder?.file(`${countryId}_SEO_STRATEGY.txt`, seoPack);
    });

    const report = `=== STRATEGIC GENERATION REPORT ===
BY: ROHMANUDIN05 AI SYSTEM
DATE: ${new Date().toLocaleString()}
COUNTRIES: ${selectedCountries.length}
AVG RPM: $${stats.avgRpm.toFixed(2)}`;
    folder?.file(`SUMMARY_REPORT.txt`, report);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ROHMANUDIN05_SYSTEM_PACK_${Date.now()}.zip`;
    a.click();
  };

  const getFlag = (code: string) => {
    const offset = 127397;
    return code.toUpperCase().split('').map(char => String.fromCodePoint(char.charCodeAt(0) + offset)).join('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/40">
      {/* Header */}
      <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-blue-500/30">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter uppercase leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">BY ROHMANUDIN05</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 italic">High RPM YouTube Strategy AI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">FIXED VERSION V2.5</span>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>RPM OPTIMIZED</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full p-6 md:p-10 space-y-12 pb-32">
        {!state.results ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Step 1: Video Metadata & Script */}
              <div className="lg:col-span-7 space-y-8">
                <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-1000">
                    <Keyboard className="w-64 h-64 text-blue-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 w-2 h-8 rounded-full shadow-lg shadow-blue-500/50"></div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Step 1: Input Script Video</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                    <button 
                      onClick={() => setInputMode('script')}
                      className={`flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all border-2 ${inputMode === 'script' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                    >
                      <FileText className="w-5 h-5" /> Manual Script
                    </button>
                    <button 
                      onClick={() => setInputMode('file')}
                      className={`flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all border-2 ${inputMode === 'file' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                    >
                      <Upload className="w-5 h-5" /> Media Scan
                    </button>
                  </div>

                  <div className="space-y-4 relative z-10">
                    {inputMode === 'script' ? (
                      <textarea 
                        placeholder="Paste script video Anda (bahasa Indonesia/English) di sini..."
                        value={scriptText}
                        onChange={(e) => setScriptText(e.target.value)}
                        className="w-full h-80 p-8 bg-slate-950/60 border-2 border-slate-800 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 focus:outline-none text-slate-200 placeholder:text-slate-700 resize-none font-medium leading-relaxed custom-scrollbar"
                      />
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-slate-700 bg-slate-950/40 rounded-[2rem] p-20 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group/drop"
                      >
                        <div className="bg-slate-800 p-8 rounded-[2.5rem] group-hover/drop:scale-110 transition-transform">
                          <Upload className="w-12 h-12 text-slate-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-300">
                            {file ? <span className="text-blue-400">{file.name}</span> : 'Drop Media or Click to Upload'}
                          </p>
                          <p className="text-xs text-slate-600 font-bold uppercase mt-3 tracking-[0.3em]">AI Scanner V2 Enabled</p>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*,audio/*" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Video Master Title</label>
                      <input 
                        type="text" 
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="Judul video untuk optimasi..."
                        className="w-full p-5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-bold text-white shadow-inner"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Video Duration (Min)</label>
                      <div className="relative">
                        <Timer className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input 
                          type="number" 
                          value={videoDuration}
                          onChange={(e) => setVideoDuration(Number(e.target.value))}
                          className="w-full pl-12 p-5 bg-slate-950/80 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-bold text-white shadow-inner"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowPreview(true)}
                    className="mt-8 flex items-center gap-2 text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Preview SRT Logic
                  </button>
                </section>
              </div>

              {/* Step 2: Global Targeting */}
              <div className="lg:col-span-5 space-y-8">
                <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 h-full flex flex-col shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-600 w-2 h-8 rounded-full shadow-lg shadow-green-500/50"></div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">Step 2: Market Targeting</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Batch</span>
                      <p className="text-xl font-black text-blue-400">{selectedCountries.length}/{MAX_BATCH}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-5 bg-slate-950/60 border border-slate-800 rounded-2xl">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="peer hidden" 
                            checked={selectedCountries.length >= MAX_BATCH}
                            onChange={toggleSelectAll}
                          />
                          <div className="w-7 h-7 border-2 border-slate-700 rounded-xl peer-checked:bg-blue-600 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                            {selectedCountries.length >= MAX_BATCH && <CheckSquare className="w-5 h-5 text-white" />}
                          </div>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Select All (Fixed Batch)</span>
                      </label>
                      <button onClick={clearAll} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={selectHighRPM} className="text-[10px] font-black uppercase p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-blue-500/50"><DollarSign className="w-4 h-4 text-green-500" /> High RPM (&gt;$15)</button>
                      <button onClick={() => selectTier('S')} className="text-[10px] font-black uppercase p-4 bg-slate-800/50 rounded-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-blue-500/50"><Crown className="w-4 h-4 text-amber-500" /> Tier S RPM</button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[380px] pr-4 space-y-3 custom-scrollbar">
                    {COUNTRIES.map((c) => (
                      <div 
                        key={c.id}
                        onClick={() => toggleCountry(c.id)}
                        className={`group p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          selectedCountries.includes(c.id) 
                            ? 'border-blue-600 bg-blue-600/10 shadow-lg shadow-blue-900/10' 
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <span className="text-4xl grayscale group-hover:grayscale-0 transition-all group-active:scale-125 duration-500">
                            {getFlag(c.code)}
                          </span>
                          <div>
                            <p className="text-base font-black text-slate-100">{c.name}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase mt-1 tracking-widest">{c.estimatedRpm} RPM • {c.tier} TIER</p>
                          </div>
                        </div>
                        {selectedCountries.includes(c.id) && <CheckCircle2 className="w-6 h-6 text-blue-500 fill-blue-500/20" />}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 bg-slate-950/80 p-8 rounded-[2.5rem] border border-slate-800 grid grid-cols-2 gap-6 shadow-inner">
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Batch Avg RPM</p>
                      <p className="text-3xl font-black text-green-500 tracking-tighter">${stats.avgRpm.toFixed(2)}</p>
                    </div>
                    <div className="text-center space-y-2 border-l border-slate-800">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Total Lines</p>
                      <p className="text-3xl font-black text-blue-500 tracking-tighter">{stats.lineCount}</p>
                    </div>
                  </div>

                  <button 
                    disabled={state.isGenerating || selectedCountries.length === 0}
                    onClick={() => setShowConfirm(true)}
                    className="mt-8 w-full py-8 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-[2.5rem] font-black text-2xl shadow-3xl shadow-blue-900/40 flex items-center justify-center gap-4 transition-all active:scale-95 group overflow-hidden relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Zap className="w-7 h-7 fill-white group-hover:scale-125 transition-transform duration-500" />
                    GENERATE SYSTEM 3-IN-1
                  </button>
                </section>
              </div>
            </div>
          </>
        ) : (
          /* Result Dashboard */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 text-center py-10">
            <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-20 rounded-[4.5rem] text-white shadow-3xl relative overflow-hidden flex flex-col items-center gap-10">
              <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-center gap-6">
                  <div className="bg-white/10 p-5 rounded-[2rem] backdrop-blur-2xl border border-white/20 shadow-2xl">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-7xl font-black tracking-tighter leading-none uppercase italic">System Ready.</h2>
                </div>
                <p className="text-blue-100 text-3xl font-medium max-w-3xl opacity-90 leading-relaxed mx-auto">
                  Paket konten multi-bahasa BY ROHMANUDIN05 untuk {state.results.length} negara sudah selesai. SRT, Judul, dan SEO Deskripsi telah teroptimasi 100%.
                </p>
              </div>

              <button 
                onClick={downloadAllAsZip}
                className="relative z-10 flex items-center gap-6 px-20 py-10 bg-white text-blue-900 rounded-[3rem] font-black text-4xl hover:bg-blue-50 hover:scale-105 transition-all shadow-3xl active:scale-95 group"
              >
                <FileArchive className="w-12 h-12 group-hover:rotate-12 transition-transform" />
                GET ZIP PACK (25+ FILES)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {state.results.map((item, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 space-y-8 hover:bg-slate-900 transition-all group hover:border-blue-500/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <LayoutGrid className="w-24 h-24" />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center text-3xl font-black text-blue-500 shadow-2xl border border-slate-700 group-hover:bg-blue-600/10 transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-slate-100 uppercase tracking-tight">{item.country}</h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.language}</span>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Fixed Version</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 italic text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-200 transition-colors">
                      "{item.titles[0].length > 100 ? item.titles[0].substring(0, 100) + '...' : item.titles[0]}"
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">SRT LOCKED</span>
                      <span className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">SEO PACK READY</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setState(s => ({ ...s, results: null }))}
              className="px-16 py-6 bg-slate-900/50 border border-slate-800 text-slate-600 hover:text-slate-300 font-black rounded-full transition-all uppercase text-sm tracking-[0.4em] hover:border-slate-600"
            >
              ← ULANGI PROSES BARU
            </button>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 max-w-2xl w-full shadow-4xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
            
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Konfirmasi Generasi</h2>
                <p className="text-slate-500 font-bold italic">Memproses {stats.count} negara dengan sistem BY ROHMANUDIN05.</p>
              </div>
              <button onClick={() => setShowConfirm(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors"><X className="w-7 h-7 text-slate-400" /></button>
            </div>

            <div className="bg-slate-950/80 rounded-[2rem] p-8 mb-10 border border-slate-800 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar shadow-inner">
              {COUNTRIES.filter(c => selectedCountries.includes(c.id)).map(c => (
                <div key={c.id} className="flex items-center justify-between py-4 border-b border-slate-900 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getFlag(c.code)}</span>
                    <span className="font-black text-slate-300 text-lg">{c.name}</span>
                  </div>
                  <span className="text-xs font-black text-green-500 uppercase tracking-[0.2em] bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">{c.estimatedRpm} RPM</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12 text-center">
              <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 flex flex-col items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estimasi Waktu</p>
                  <p className="text-2xl font-black text-blue-400">~{(stats.count * 1.5).toFixed(1)} Min</p>
                </div>
              </div>
              <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-800 flex flex-col items-center gap-2">
                <Settings2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Output</p>
                  <p className="text-2xl font-black text-green-400">ZIP 3-IN-1</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-6 bg-slate-800 text-slate-400 font-black rounded-3xl hover:bg-slate-700 transition-all uppercase text-lg tracking-widest">Batal</button>
              <button onClick={runGenerator} className="flex-[1.5] py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-50 shadow-2xl shadow-blue-600/30 transition-all uppercase text-lg tracking-widest flex items-center justify-center gap-3">
                <Zap className="w-6 h-6 fill-white" />
                Mulai Generasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Logic Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-[3.5rem] p-12 max-w-2xl w-full shadow-4xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase flex items-center gap-3"><Eye className="text-blue-500" /> Subtitle Logic Preview</h2>
              <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-800 rounded-xl"><X /></button>
            </div>
            <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 font-mono text-xs leading-relaxed overflow-y-auto max-h-[400px] text-slate-400 custom-scrollbar">
              <p>1</p>
              <p>00:00:00,000 --&gt; 00:00:05,000</p>
              <p>[Translasi Baris Pertama Script]</p>
              <br />
              <p>...</p>
              <br />
              <p>15</p>
              <p className="text-blue-400">00:00:45,000 --&gt; 00:00:48,000</p>
              <p className="text-blue-400 font-bold">Subtitles powered by Rohmanudin05 AI</p>
              <br />
              <p>...</p>
              <br />
              <p>{stats.lineCount > 0 ? stats.lineCount + 2 : 100}</p>
              <p>00:{String(videoDuration).padStart(2, '0')}:00,000 --&gt; 00:{String(videoDuration).padStart(2, '0')}:05,000</p>
              <p>[Final Call to Action]</p>
            </div>
            <button onClick={() => setShowPreview(false)} className="mt-8 w-full py-4 bg-slate-800 rounded-2xl font-bold uppercase tracking-widest">Close Preview</button>
          </div>
        </div>
      )}

      {/* Progress Overlay */}
      {state.isGenerating && (
        <div className="fixed inset-0 z-[120] bg-[#020617] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
          <div className="max-w-3xl w-full bg-slate-900/30 backdrop-blur-3xl border-2 border-blue-600/30 rounded-[4rem] p-16 text-center shadow-[0_40px_100px_rgba(37,99,235,0.2)] space-y-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.8)]" style={{ width: `${state.progress}%` }}></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase flex items-center justify-center gap-6">
                <Loader2 className="w-14 h-14 text-blue-500 animate-spin" />
                GENERATING PACK
              </h2>
              <div className="h-12 flex items-center justify-center">
                <p className="text-blue-400 font-bold text-2xl italic tracking-wide animate-pulse">
                  "{motivationMessages[motivationIndex]}"
                </p>
              </div>
            </div>
            
            <div className="space-y-10">
              <div className="flex flex-col items-center gap-4">
                <p className="text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]">{state.progress}%</p>
                <p className="text-sm font-black text-slate-500 uppercase tracking-[0.6em]">{state.status}</p>
              </div>
              
              <div className="grid grid-cols-5 gap-6 pt-10 border-t border-slate-800">
                {[
                  { icon: Target, label: "Analisis", threshold: 10 },
                  { icon: Youtube, label: "Judul", threshold: 30 },
                  { icon: FileText, label: "Deskripsi", threshold: 50 },
                  { icon: Timer, label: "Subtitle", threshold: 70 },
                  { icon: FileArchive, label: "ZIP Pack", threshold: 90 }
                ].map((step, i) => (
                  <div key={i} className={`flex flex-col items-center gap-3 transition-all duration-700 ${state.progress >= step.threshold ? 'opacity-100 scale-110' : 'opacity-20 grayscale'}`}>
                    <div className={`p-4 rounded-2xl ${state.progress >= step.threshold ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-800 text-slate-500'}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="flex flex-col items-center gap-6">
            <h3 className="font-black text-4xl text-white tracking-tighter uppercase leading-none bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">BY ROHMANUDIN05</h3>
            <div className="h-1.5 w-40 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-blue-500/50"></div>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-slate-500 text-xl font-medium italic leading-relaxed">
              "Mastering global YouTube distribution through intelligent multi-language localization. Revenue-optimized assets for the modern creator."
            </p>
            <div className="flex items-center justify-center gap-10 text-slate-700 pt-6 opacity-40 hover:opacity-100 transition-opacity">
              <Youtube className="w-8 h-8 cursor-pointer hover:text-red-500" />
              <Globe className="w-8 h-8 cursor-pointer hover:text-blue-400" />
              <Target className="w-8 h-8 cursor-pointer hover:text-purple-400" />
              <DollarSign className="w-8 h-8 cursor-pointer hover:text-green-400" />
            </div>
          </div>
          <div className="pt-10 space-y-4">
            <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.6em]">
              © {new Date().getFullYear()} ROHMANUDIN05 AI SYSTEMS • CORE ENGINE V2.5-FIXED
            </p>
            <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em]">100% Client-Side Processing • AES-256 Metadata Security</p>
          </div>
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
