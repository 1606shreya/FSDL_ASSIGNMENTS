import React, { useState } from 'react';
import { Search, MapPin, Pill, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const NearbyPharmacies = () => {
    const { t } = useTranslation();
    const [medicine, setMedicine] = useState('');
    const [location, setLocation] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const searchPharmacies = async (e) => {
        if (e) e.preventDefault();

        if (!medicine.trim()) {
            setError(t('Please enter a medicine name'));
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const queryParams = new URLSearchParams({
                medicine: medicine.trim()
            });

            if (location.trim()) {
                queryParams.append('location', location.trim());
            }

            const response = await fetch(`http://localhost:5000/api/pharmacy/search?${queryParams.toString()}`);

            if (!response.ok) {
                throw new Error(t('Failed to fetch pharmacies'));
            }

            let data = await response.json();

            // Filter out items with 0 quantity (Rule #6)
            data = data.filter(p => p.quantity > 0);

            setPharmacies(data);
        } catch (err) {
            setError(err.message || t('An error occurred while searching'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6 max-w-4xl mx-auto mt-8 hidden-scrollbar">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <MapPin className="text-blue-500" />
                {t('Nearby Pharmacy Availability')}
            </h2>

            <form onSubmit={searchPharmacies} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('Generic Medicine Name *')}</label>
                        <div className="relative">
                            <Pill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <input
                                type="text"
                                value={medicine}
                                onChange={(e) => setMedicine(e.target.value)}
                                placeholder={t("e.g. Paracetamol")}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('Location (Optional)')}</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={t("Filter by location...")}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                        {t('Search Pharmacies')}
                    </button>
                </div>
            </form>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-start gap-3 mb-6">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {hasSearched && !loading && !error && (
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-300 mb-4 border-b border-gray-800 pb-2">
                        {pharmacies.length} {pharmacies.length === 1 ? t('Pharmacy') : t('Pharmacies')} {t('Found')}
                    </h3>

                    {pharmacies.length === 0 ? (
                        <div className="text-center py-10 bg-gray-800/50 rounded-lg border border-gray-800">
                            <Pill className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">{t('No pharmacies found with available stock for')} "{medicine}"{location ? ` in ${location}` : ''}.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pharmacies.map((pharmacy) => (
                                <div key={pharmacy._id} className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-blue-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-lg font-bold text-white">{pharmacy.pharmacy_name}</h4>
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${pharmacy.quantity > 50
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {pharmacy.quantity > 50 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                            {pharmacy.quantity > 50 ? t('In Stock') : t('Low Stock')}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-gray-400 gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span>{pharmacy.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400 gap-2">
                                            <Pill className="w-4 h-4 text-gray-500" />
                                            <span>{t('Medicine')}: <span className="text-blue-400 font-medium">{pharmacy.generic_name}</span></span>
                                        </div>
                                        <div className="flex items-center text-gray-400 gap-2">
                                            <div className="w-4 h-4 flex items-center justify-center text-gray-500 font-bold text-xs">#</div>
                                            <span>{t('Quantity Available')}: <span className="text-white font-medium">{pharmacy.quantity} {t('units')}</span></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NearbyPharmacies;
