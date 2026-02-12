import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const AddressForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        street: initialData?.street || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zip: initialData?.zip || '',
        country: initialData?.country || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
                label="Street Address"
                name="street"
                placeholder="123 Main St"
                value={formData.street}
                onChange={handleChange}
                required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                    label="City"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="State"
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Input
                    label="ZIP Code"
                    name="zip"
                    placeholder="10001"
                    value={formData.zip}
                    onChange={handleChange}
                />

                <Input
                    label="Country"
                    name="country"
                    placeholder="USA"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        style={{ flex: 1 }}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    style={{ flex: 1 }}
                >
                    {initialData ? 'Update Address' : 'Add Address'}
                </Button>
            </div>
        </form>
    );
};

export default AddressForm;
