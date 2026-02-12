import React, { useState } from 'react';
import './AddressCard.css';

const AddressCard = ({
    address,
    onUpdate,
    onDelete,
    selectable = false,
    selected = false,
    onSelect
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zip: address.zip || '',
        country: address.country || ''
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            street: address.street || '',
            city: address.city || '',
            state: address.state || '',
            zip: address.zip || '',
            country: address.country || ''
        });
    };

    const handleSave = async () => {
        await onUpdate(address._id, editData);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handleCardClick = () => {
        if (selectable && !isEditing) {
            onSelect(address._id);
        }
    };

    return (
        <div
            className={`address-card ${selectable ? 'selectable' : ''} ${selected ? 'selected' : ''}`}
            onClick={handleCardClick}
        >
            {selectable && (
                <input
                    type="radio"
                    className="address-card-radio"
                    checked={selected}
                    onChange={() => onSelect(address._id)}
                    onClick={(e) => e.stopPropagation()}
                />
            )}

            {!isEditing ? (
                <>
                    <div className="address-card-header">
                        <div className="address-card-details">
                            <p className="address-street">{address.street}</p>
                            <p>{address.city}, {address.state} {address.zip}</p>
                            <p>{address.country}</p>
                        </div>
                        {!selectable && (
                            <div className="address-card-actions">
                                <button
                                    className="address-card-btn address-card-edit"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                                <button
                                    className="address-card-btn address-card-delete"
                                    onClick={() => onDelete(address._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="address-edit-form" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={editData.street}
                        onChange={handleChange}
                        required
                    />
                    <div className="address-edit-row">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={editData.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={editData.state}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="address-edit-row">
                        <input
                            type="text"
                            name="zip"
                            placeholder="ZIP Code"
                            value={editData.zip}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={editData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="address-edit-actions">
                        <button
                            className="address-cancel-btn"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="address-save-btn"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressCard;
