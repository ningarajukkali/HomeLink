import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ReplacePropertyModal from '../components/ReplacePropertyModal';
import AddPropertyModal from '../components/AddPropertyModal';
import DemoBadge from '../components/DemoBadge';
import DemoNoticeBanner from '../components/DemoNoticeBanner';

export default function CompareView() {
  const {
    properties,
    comparePropertyIds,
    removeFromCompare,
    clearCompare,
    navigate,
    goBack,
    isPropertySaved,
    toggleSaveProperty,
    rentalFilters
  } = useApp();

  const [replaceTargetId, setReplaceTargetId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inquirySentMap, setInquirySentMap] = useState({});

  const comparedProperties = comparePropertyIds
    .map((id) => properties.find((p) => p.id === id))
    .filter(Boolean);

  const count = comparedProperties.length;

  const handleSendRequest = (prop) => {
    setInquirySentMap((prev) => ({ ...prev, [prop.id]: true }));
    setTimeout(() => {
      alert(`Visit request sent to ${prop.owner?.name}! They typically respond in ${prop.owner?.responseRate || '30 mins'}.`);
    }, 300);
  };

  // Helper for checkmarks vs dash
  const renderCheckmark = (isPresent, text = '') => {
    if (isPresent) {
      return (
        <span className="inline-flex items-center gap-1 font-extrabold text-xs text-[#00A88E] bg-[#00A88E]/10 px-2 py-0.5 rounded-full">
          <span className="material-symbols-outlined text-sm font-bold">check</span>
          <span>{text || 'Yes'}</span>
        </span>
      );
    }
    return <span className="text-outline/60 font-bold text-xs">—</span>;
  };

  // 0 Properties Empty State
  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#00A88E]/10 text-[#00A88E] flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-4xl">compare_arrows</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-on-surface">Compare your options</h2>
          <p className="text-sm text-outline font-medium mt-1">
            Select at least 2 properties to compare side-by-side on rent, deposit, amenities, and rules.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('rentals')}
            className="px-6 py-3 rounded-2xl bg-[#00A88E] hover:bg-[#00927b] text-white font-extrabold text-sm shadow-md shadow-[#00A88E]/30 transition-all cursor-pointer"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  // Active user requirements derived from current filters
  const userRequirements = [
    {
      label: `Budget under ₹${(rentalFilters.maxRent || 6000).toLocaleString('en-IN')}`,
      check: (p) => p.rent <= (rentalFilters.maxRent || 6000)
    },
    {
      label: 'Wi-Fi Included / Available',
      check: (p) => p.amenities?.some((a) => a.toLowerCase().includes('wi-fi'))
    },
    {
      label: 'Furnished / Semi-Furnished',
      check: (p) => p.furnished?.toLowerCase().includes('furnished')
    },
    {
      label: rentalFilters.locality && rentalFilters.locality !== 'All Rewa'
        ? `In ${rentalFilters.locality}`
        : 'Rewa City Transit (< 1.5 km)',
      check: (p) => {
        if (rentalFilters.locality && rentalFilters.locality !== 'All Rewa') {
          return p.locality?.toLowerCase().includes(rentalFilters.locality.toLowerCase());
        }
        return true;
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-28 md:pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-outline-variant/40 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer shrink-0"
            title="Go back"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-on-surface tracking-tight">
                Compare Properties
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#00A88E]/10 text-[#006b5a] border border-[#00A88E]/25">
                {count} of 4 Selected
              </span>
            </div>
            <p className="text-xs text-outline font-medium">
              Side-by-side comparison in Rewa • Demo Preview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {count < 4 && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00A88E]/10 hover:bg-[#00A88E]/20 text-[#006b5a] text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Property</span>
            </button>
          )}

          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 rounded-xl text-xs font-bold text-outline hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNoticeBanner />

      {/* 1 Property Remaining Notice */}
      {count === 1 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
            <span>Add one more property to compare specifications side-by-side.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors cursor-pointer shrink-0"
          >
            + Add Another
          </button>
        </div>
      )}

      {/* 8. SMART COMPARISON: Your Requirements Matrix */}
      <div className="bg-white rounded-2xl border border-outline-variant/40 p-4 md:p-5 shadow-xs overflow-hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#00A88E]">verified_user</span>
            <h3 className="font-extrabold text-sm md:text-base text-on-surface">
              Your Requirements
            </h3>
          </div>
          <span className="text-[11px] text-outline font-medium hidden sm:inline">
            Informational checklist • Objective comparison
          </span>
        </div>

        <div className="overflow-x-auto pb-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-outline">
                <th className="py-2.5 pr-4 font-bold min-w-[160px] text-on-surface">Requirement</th>
                {comparedProperties.map((p) => (
                  <th key={p.id} className="py-2.5 px-3 font-bold min-w-[150px] text-on-surface truncate">
                    {p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {userRequirements.map((req, rIdx) => (
                <tr key={rIdx} className="hover:bg-surface/50 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-on-surface">
                    {req.label}
                  </td>
                  {comparedProperties.map((p) => {
                    const match = req.check(p);
                    return (
                      <td key={p.id} className="py-2.5 px-3">
                        {match ? (
                          <span className="inline-flex items-center gap-1 text-[#00A88E] font-black">
                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                            <span>Match</span>
                          </span>
                        ) : (
                          <span className="text-outline/60 font-bold">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. MAIN HORIZONTAL COMPARISON TABLE */}
      <div className="bg-white rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[680px]">
            {/* Table Header: Property Cards & Quick Actions */}
            <thead>
              <tr className="bg-surface/60 border-b border-outline-variant/30">
                <th className="w-44 p-4 text-left font-black text-xs uppercase tracking-wider text-outline shrink-0 align-top">
                  Specifications
                </th>

                {comparedProperties.map((prop) => (
                  <th key={prop.id} className="w-72 p-4 text-left align-top font-normal">
                    <div className="bg-white rounded-2xl border border-outline-variant/40 overflow-hidden shadow-2xs hover:shadow-md transition-shadow">
                      {/* Photo */}
                      <div className="relative aspect-[16/10] bg-surface-container overflow-hidden">
                        <img
                          src={prop.images?.[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <DemoBadge size="sm" variant="white" />
                          {prop.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div className="p-3 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-[#00A88E]">
                            ₹{prop.rent.toLocaleString('en-IN')}
                            <span className="text-xs font-semibold text-outline">/mo</span>
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                            {prop.propertyType}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-on-surface line-clamp-1">
                          {prop.title}
                        </h4>

                        <p className="text-[11px] text-outline flex items-center gap-0.5 truncate">
                          <span className="material-symbols-outlined text-[13px] text-[#00A88E]">location_on</span>
                          {prop.locality}
                        </p>

                        {/* Top Action Buttons: Replace & Remove */}
                        <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setReplaceTargetId(prop.id)}
                            className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-[#131b2e] text-[11px] font-bold transition-colors cursor-pointer"
                            title="Replace with another property"
                          >
                            <span className="material-symbols-outlined text-xs text-[#00A88E]">swap_horiz</span>
                            <span>Replace</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromCompare(prop.id)}
                            className="flex items-center justify-center p-1 rounded-lg text-outline hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Optional + Add Column slot if fewer than 4 */}
                {count < 4 && (
                  <th className="w-56 p-4 text-center align-middle font-normal">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-[#00A88E]/40 hover:border-[#00A88E] bg-[#00A88E]/[0.02] hover:bg-[#00A88E]/[0.06] p-4 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#00A88E]/10 group-hover:bg-[#00A88E] text-[#00A88E] group-hover:text-white flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-2xl">add</span>
                      </div>
                      <span className="font-extrabold text-xs text-[#006b5a]">
                        + Add Property
                      </span>
                      <span className="text-[11px] text-outline font-medium">
                        Compare up to 4 ({4 - count} slots left)
                      </span>
                    </button>
                  </th>
                )}
              </tr>
            </thead>

            {/* Table Body: Detailed Specifications */}
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {/* SECTION: PRICING & TERMS */}
              <tr className="bg-surface-container/30">
                <td colSpan={comparedProperties.length + (count < 4 ? 2 : 1)} className="py-2 px-4 font-black uppercase text-[11px] text-[#006b5a] tracking-wider">
                  💰 Pricing & Deposit
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Monthly Rent</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-black text-sm text-[#00A88E]">
                    ₹{p.rent.toLocaleString('en-IN')}/month
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Security Deposit</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    ₹{p.deposit.toLocaleString('en-IN')} (Refundable)
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Brokerage</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    {renderCheckmark(true, '₹0 Zero Brokerage')}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Minimum Stay</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.minimumStay || '3 Months'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Availability</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.availableFrom || 'Immediately'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>

              {/* SECTION: UNIT & OCCUPANCY */}
              <tr className="bg-surface-container/30">
                <td colSpan={comparedProperties.length + (count < 4 ? 2 : 1)} className="py-2 px-4 font-black uppercase text-[11px] text-[#006b5a] tracking-wider">
                  🏠 Unit & Occupancy
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Property Type</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.propertyType} ({p.bhk})
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Furnishing</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.furnished}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Suitable For</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.preferredTenant}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Location / Distance</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    <div>{p.locality}</div>
                    <div className="text-[11px] text-outline mt-0.5">{p.distance || 'Rewa'}</div>
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>

              {/* SECTION: AMENITIES & FACILITIES */}
              <tr className="bg-surface-container/30">
                <td colSpan={comparedProperties.length + (count < 4 ? 2 : 1)} className="py-2 px-4 font-black uppercase text-[11px] text-[#006b5a] tracking-wider">
                  ⚡ Amenities & Utilities
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Wi-Fi Internet</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    {renderCheckmark(p.amenities?.some((a) => a.toLowerCase().includes('wi-fi')), 'High-speed Wi-Fi')}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Water Supply</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.water || '24/7 RO Supply'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Electricity / Tariff</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.electricity || 'Separate Sub-meter'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Bathroom</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.bathroom || 'Attached Washroom'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">AC / Cooling</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.ac || 'Cooler Point Ready'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Furniture Provided</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.furniture || 'Bed, Desk & Storage'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Kitchen Access</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.kitchen || 'Kitchen Space Available'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Parking</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.parking || 'Two-wheeler Covered'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Geyser / Hot Water</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    {renderCheckmark(
                      p.amenities?.some((a) => a.toLowerCase().includes('geyser') || a.toLowerCase().includes('water heater')),
                      p.geyser || 'Installed'
                    )}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Washing Machine</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.washingMachine || 'Common Machine'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">CCTV & Security</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    {renderCheckmark(
                      p.amenities?.some((a) => a.toLowerCase().includes('cctv') || a.toLowerCase().includes('security')),
                      p.cctv || '24/7 Monitored'
                    )}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Food / Mess Options</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    {p.food || 'Self-cook / Tiffin Service'}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>

              {/* SECTION: TRUST & SAFETY */}
              <tr className="bg-surface-container/30">
                <td colSpan={comparedProperties.length + (count < 4 ? 2 : 1)} className="py-2 px-4 font-black uppercase text-[11px] text-[#006b5a] tracking-wider">
                  🛡️ Trust & Host Information
                </td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Rewa SafeNet KYC</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4">
                    {renderCheckmark(p.isVerified, 'Demo Host (Preview)')}
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Host Name & Type</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    <div>{p.owner?.name} (Demo Host)</div>
                    <div className="text-[11px] text-outline">{p.owner?.type} (Resp: {p.owner?.responseRate})</div>
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
              <tr>
                <td className="p-4 font-bold text-outline">Rating & Reviews</td>
                {comparedProperties.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-on-surface">
                    ⭐ {p.rating} / 5.0 ({p.reviewsCount} reviews)
                  </td>
                ))}
                {count < 4 && <td />}
              </tr>
            </tbody>

            {/* 9. PROPERTY ACTIONS AT BOTTOM OF EACH COLUMN */}
            <tfoot>
              <tr className="bg-surface/60 border-t-2 border-outline-variant/40">
                <td className="p-4 font-black text-xs uppercase tracking-wider text-outline">
                  Actions
                </td>
                {comparedProperties.map((prop) => {
                  const saved = isPropertySaved(prop.id);
                  const isSent = inquirySentMap[prop.id];

                  return (
                    <td key={prop.id} className="p-4 align-top">
                      <div className="space-y-2">
                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => navigate('rental-detail', { propertyId: prop.id })}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#00A88E] hover:bg-[#00927b] text-white text-xs font-bold transition-all shadow-sm shadow-[#00A88E]/25 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>View Details</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>

                        {/* Send Request Button */}
                        <button
                          type="button"
                          onClick={() => handleSendRequest(prop)}
                          disabled={isSent}
                          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            isSent
                              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                              : 'bg-white hover:bg-surface-container text-[#131b2e] border-outline-variant/60'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isSent ? 'check_circle' : 'mail'}
                          </span>
                          <span>{isSent ? 'Request Sent' : 'Send Request'}</span>
                        </button>

                        {/* Save Button */}
                        <button
                          type="button"
                          onClick={() => toggleSaveProperty(prop.id)}
                          className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            saved
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : 'bg-white hover:bg-surface-container text-outline border-outline-variant/40'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-sm ${saved ? 'fill-current' : ''}`}>
                            favorite
                          </span>
                          <span>{saved ? 'Saved' : 'Save'}</span>
                        </button>
                      </div>
                    </td>
                  );
                })}
                {count < 4 && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Replace Property Bottom Sheet Modal */}
      <ReplacePropertyModal
        isOpen={Boolean(replaceTargetId)}
        onClose={() => setReplaceTargetId(null)}
        targetPropertyId={replaceTargetId}
      />

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
