import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { generateDescription } from '../services/geminiService';
import Spinner from './Spinner';
import { ProductVariant } from '../types';

const AdminProductForm: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [hasVariants, setHasVariants] = useState(false);
    const [stock, setStock] = useState('');
    const [variants, setVariants] = useState<{size: string, stock: string}[]>([{ size: '', stock: '' }]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { addProduct } = useProducts();

    const handleGenerateDescription = async () => {
        if (!name) {
            setError('Please enter a product name first.');
            return;
        }
        setError('');
        setIsGenerating(true);
        try {
            const generatedDesc = await generateDescription(name);
            setDescription(generatedDesc);
        } catch (err) {
            setError('Failed to generate description.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleVariantChange = (index: number, field: 'size' | 'stock', value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const addVariantField = () => {
        setVariants([...variants, { size: '', stock: '' }]);
    };

    const removeVariantField = (index: number) => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDescription('');
        setImageUrl('');
        setHasVariants(false);
        setStock('');
        setVariants([{ size: '', stock: '' }]);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !description || !imageUrl) {
            setError('Please fill out all required fields.');
            return;
        }

        const productData: any = { name, price: parseFloat(price), description, imageUrl };
        
        if (hasVariants) {
            if (variants.some(v => !v.size || !v.stock || parseInt(v.stock) < 0)) {
                setError('Please fill out all size and stock fields for variants. Stock must be non-negative.');
                return;
            }
            productData.variants = variants.map(v => ({ size: v.size, stock: parseInt(v.stock) }));
        } else {
             if (!stock || parseInt(stock) < 0) {
                setError('Please provide a valid stock quantity (must be non-negative).');
                return;
            }
            productData.stock = parseInt(stock);
        }
        
        addProduct(productData);
        setSuccess(`Product "${name}" added successfully!`);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
    };
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="flex items-center space-x-2">
                        <textarea id="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required></textarea>
                        <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors self-center">
                            {isGenerating ? <Spinner /> : 'AI ✨'}
                        </button>
                    </div>
                </div>

                {/* --- Stock/Variants Logic --- */}
                <div className="space-y-4 rounded-md border border-gray-200 p-4">
                     <div className="flex items-center">
                        <input id="hasVariants" type="checkbox" checked={hasVariants} onChange={e => setHasVariants(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="hasVariants" className="ml-2 block text-sm font-medium text-gray-900">This product has variants (e.g., sizes)</label>
                    </div>

                    {hasVariants ? (
                        <div className="space-y-4">
                            {variants.map((variant, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="text" placeholder="Size (e.g., Small)" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                    <input type="number" placeholder="Stock" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} className="block w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                    {variants.length > 1 && <button type="button" onClick={() => removeVariantField(index)} className="text-red-500 hover:text-red-700 p-1">&times;</button>}
                                </div>
                            ))}
                            <button type="button" onClick={addVariantField} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add another size</button>
                        </div>
                    ) : (
                        <div>
                             <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                            <input type="number" id="stock" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
                        </div>
                    )}
                </div>
                 {/* --- End Stock/Variants Logic --- */}

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
