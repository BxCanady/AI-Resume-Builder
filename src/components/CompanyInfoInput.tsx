import React from 'react';

interface CompanyInfo {
    name: string;
    position: string;
}

interface CompanyInfoInputProps {
    company: CompanyInfo;
    index: number;
    handleUpdateCompany: (e: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => void;
    handleRemoveCompany: (index: number) => void;
}

const CompanyInfoInput: React.FC<CompanyInfoInputProps> = ({ company, index, handleUpdateCompany, handleRemoveCompany }) => {
    return (
        <div className="company-info">
            <div className="form-group">
                <label htmlFor={`companyName${index}`} className="label">Company Name</label>
                <input
                    type="text"
                    required
                    name={`companyName${index}`} // Make sure the input field has a unique name
                    value={company.name}
                    onChange={(e) => handleUpdateCompany(e, index, 'name')} // Pass the field name 'name'
                    className="input-field"
                />
            </div>
            <div className="form-group">
                <label htmlFor={`position${index}`} className="label">Position</label>
                <input
                    type="text"
                    required
                    name={`position${index}`} // Make sure the input field has a unique name
                    value={company.position}
                    onChange={(e) => handleUpdateCompany(e, index, 'position')} // Pass the field name 'position'
                    className="input-field"
                />
            </div>
            <div className="button-group">
                <button
                    type="button"
                    onClick={() => handleRemoveCompany(index)}
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-r-lg mt-1"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default CompanyInfoInput;