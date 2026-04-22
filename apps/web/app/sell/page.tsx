'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useCreateListing, useUploadImages, useCategories } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Upload, X, Check } from 'lucide-react';

const BANGALORE_PINCODES: Record<string, string> = {
  '560001': 'Bangalore GPO',
  '560002': 'Bangalore City Market',
  '560003': 'Gandhinagar',
  '560004': 'Bangalore',
  '560005': 'Chamrajpet',
  '560006': 'Basavanagudi',
  '560008': 'Malleswaram',
  '560009': 'Rajaji Nagar',
  '560010': 'Yeshwantpur',
  '560011': 'Hesaraghatta',
  '560012': 'Jalahalli',
  '560013': 'Malleshwaram',
  '560016': 'Varthur',
  '560017': 'Yelahanka',
  '560019': 'Bangalore Cantonment',
  '560020': 'Bangalore High Grounds',
  '560021': 'Shivaji Nagar',
  '560022': 'Cox Town',
  '560023': 'Benson Town',
  '560024': 'Frazer Town',
  '560025': 'Ulsoor',
  '560027': 'BTM Layout',
  '560029': 'JP Nagar',
  '560030': 'Jayanagar',
  '560034': 'HSR Layout',
  '560035': 'Banashankari',
  '560036': 'Girinagar',
  '560037': 'Uttarahalli',
  '560038': 'Banashankari',
  '560040': 'Hanumanthnagar',
  '560041': 'Padmanabha Nagar',
  '560043': 'Koramangala',
  '560047': 'Koramangala',
  '560050': 'Rajaji Nagar',
  '560051': 'Agara',
  '560054': 'Victoria Layout',
  '560064': 'Bannerghatta',
  '560066': 'Marathahalli',
  '560068': 'Koramangala',
  '560070': 'Muneshwara Nagar',
  '560071': 'Agram',
  '560076': 'Electronic City',
  '560078': 'Kengeri',
  '560085': 'Indiranagar',
  '560092': 'Whitefield',
  '560093': 'Marathahalli',
  '560095': 'Koramangala',
  '560102': 'Yelahanka',
  '560103': 'Jala Hobli',
};

export default function SellPage() {
  const router = useRouter();
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: catData, isLoading: catsLoading } = useCategories();
  const categories = catData?.categories || [];
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    condition: 'A' as 'A' | 'B' | 'C',
    price: '',
    negotiable: true,
    pincode: '',
    ageYears: '',
    hasBill: false,
    processor: '',
    memory: '',
    storage: '',
    display: '',
    graphics: '',
    warrantyType: '',
    warrantyFrom: '',
    warrantyPeriod: '',
    warrantyDetails: '',
  });
  const [pincodeInfo, setPincodeInfo] = useState<string>('');
  const [error, setError] = useState('');

  const uploadImages = useUploadImages();
  const createListing = useCreateListing();

  useEffect(() => {
    if (authLoading) return;
    if (!authData?.user) {
      router.replace('/auth/signin?redirect=/sell');
      return;
    }
    if (authData.user.role !== 'ADMIN') {
      router.replace('/browse');
    }
  }, [authLoading, authData, router]);

  if (authLoading || !authData?.user || authData.user.role !== 'ADMIN') {
    return (
      <>
        <Nav />
        <main className="flex-1 min-h-[50vh] flex items-center justify-center px-4 text-[var(--muted)]">
          {authLoading ? 'Loading…' : 'Checking access…'}
        </main>
      </>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });
    
    if (pincode.length === 6) {
      if (BANGALORE_PINCODES[pincode]) {
        setPincodeInfo(`${BANGALORE_PINCODES[pincode]} · Bangalore verified`);
      } else {
        setPincodeInfo('Not a valid Bangalore pincode');
      }
    } else {
      setPincodeInfo('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    if (!BANGALORE_PINCODES[formData.pincode]) {
      setError('Invalid Bangalore pincode');
      return;
    }

    try {
      const uploadResult = await uploadImages.mutateAsync(images);
      const imageUrls = uploadResult.urls;

      await createListing.mutateAsync({
        ...formData,
        price: parseInt(formData.price),
        ageYears: formData.ageYears ? parseFloat(formData.ageYears) : undefined,
        imageUrls,
      });

      router.push('/my-listings');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
    }
  };

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen py-8">
        <div className="max-w-[600px] mx-auto px-8">
          <div className="bg-[var(--bg-elevated)] border border-[var(--line)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <form onSubmit={handleSubmit} className="p-8 sm:p-10">
              <h1 className="font-serif text-[clamp(26px,3.2vw,36px)] font-normal tracking-[-0.025em] leading-[1.1] mb-2.5 text-ink">
                List your item
              </h1>
              <p className="text-sm text-muted mb-8">
                Free to list · buyers reach you on WhatsApp directly.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-rose-soft border border-rose/20 rounded-lg text-sm text-rose">
                  {error}
                </div>
              )}

              <div className="mb-5.5">
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Photos · up to 5
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-[var(--line)]">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose text-white flex items-center justify-center text-xs hover:bg-rose/90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="aspect-square rounded-lg border-[1px] border-dashed border-[var(--line-strong)] flex items-center justify-center cursor-pointer hover:border-forest transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-muted-2" />
                    </label>
                  )}
                </div>
                <p className="text-xs text-muted">JPG or PNG · max 5 MB each</p>
              </div>

              <div className="mb-5.5">
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Dell UltraSharp U2419H · 24 inch IPS"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 mb-5.5">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Category
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Age
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ageYears}
                    onChange={(e) => setFormData({ ...formData, ageYears: e.target.value })}
                    placeholder="2.5"
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  />
                </div>
              </div>

              <div className="mb-5.5">
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Condition
                </label>
                <div className="flex gap-1.5">
                  {(['A', 'B', 'C'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond })}
                      className={`flex-1 font-mono text-[11px] py-3 px-3 border-[0.5px] rounded-[10px] transition-all ${
                        formData.condition === cond
                          ? 'bg-ink text-bg border-ink'
                          : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
                      }`}
                    >
                      Grade {cond} · {cond === 'A' ? 'like new' : cond === 'B' ? 'good' : 'fair'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_160px] gap-3.5 mb-5.5">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="6800"
                    className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                    Negotiable
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, negotiable: true })}
                      className={`flex-1 font-mono text-[11px] py-3 px-3 border-[0.5px] rounded-full transition-all ${
                        formData.negotiable
                          ? 'bg-ink text-bg border-ink'
                          : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, negotiable: false })}
                      className={`flex-1 font-mono text-[11px] py-3 px-3 border-[0.5px] rounded-full transition-all ${
                        !formData.negotiable
                          ? 'bg-ink text-bg border-ink'
                          : 'border-[var(--line-strong)] text-ink-soft hover:border-ink'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="mb-5.5">
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Bangalore pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="560095"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
                {pincodeInfo && (
                  <div className="text-xs text-forest-text mt-2 flex items-center gap-1.5 font-medium">
                    {BANGALORE_PINCODES[formData.pincode] ? (
                      <>
                        <Check className="w-3 h-3" />
                        {pincodeInfo}
                      </>
                    ) : (
                      <span className="text-rose">{pincodeInfo}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-5.5">
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Selling my Dell UltraSharp U2419H. No dead pixels, bill available. Can meet near Forum Mall or IIIT-B gate."
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)] resize-none"
                />
              </div>

              {/* Technical Specifications - Optional */}
              <div className="mb-5.5 p-4 border-[0.5px] border-[var(--line)] rounded-[10px] bg-[var(--bg-muted)]">
                <h3 className="font-serif text-base mb-3 text-ink">Technical Specifications (Optional)</h3>
                <p className="text-xs text-muted mb-4">Add detailed specs for laptops/electronics</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Processor</label>
                    <input
                      type="text"
                      value={formData.processor}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                      placeholder="Intel Core i7-1365U"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Memory</label>
                    <input
                      type="text"
                      value={formData.memory}
                      onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                      placeholder="32 GB LPDDR5X RAM"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Storage</label>
                    <input
                      type="text"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      placeholder="512 GB NVMe SSD"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Display</label>
                    <input
                      type="text"
                      value={formData.display}
                      onChange={(e) => setFormData({ ...formData, display: e.target.value })}
                      placeholder="13.3&quot; FHD, 300 nits"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Graphics</label>
                    <input
                      type="text"
                      value={formData.graphics}
                      onChange={(e) => setFormData({ ...formData, graphics: e.target.value })}
                      placeholder="Intel Iris Xe Graphics"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                </div>
              </div>

              {/* Warranty Information - Optional */}
              <div className="mb-5.5 p-4 border-[0.5px] border-[var(--line)] rounded-[10px] bg-[var(--bg-muted)]">
                <h3 className="font-serif text-base mb-3 text-ink">Warranty Information (Optional)</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Type</label>
                    <input
                      type="text"
                      value={formData.warrantyType}
                      onChange={(e) => setFormData({ ...formData, warrantyType: e.target.value })}
                      placeholder="Onsite"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">From</label>
                    <input
                      type="text"
                      value={formData.warrantyFrom}
                      onChange={(e) => setFormData({ ...formData, warrantyFrom: e.target.value })}
                      placeholder="OEM"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Period</label>
                    <input
                      type="text"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                      placeholder="36 Months"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-muted block mb-1.5">Details</label>
                    <textarea
                      rows={2}
                      value={formData.warrantyDetails}
                      onChange={(e) => setFormData({ ...formData, warrantyDetails: e.target.value })}
                      placeholder="3 Years Onsite With ADP Warranty"
                      className="w-full px-3 py-2 border-[0.5px] border-[var(--line-strong)] rounded-lg font-sans text-xs bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasBill}
                    onChange={(e) => setFormData({ ...formData, hasBill: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--line-strong)] text-forest focus:ring-forest"
                  />
                  <span className="text-sm text-ink">I have the original bill</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="forest"
                size="xl"
                className="w-full justify-center"
                disabled={uploadImages.isPending || createListing.isPending}
              >
                {uploadImages.isPending || createListing.isPending ? 'Posting...' : 'Post listing →'}
              </Button>

              <p className="text-xs text-muted text-center mt-4">
                By listing you agree to community rules · no stolen goods, no commercial sellers.
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
