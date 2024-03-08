import React, { useState, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skills from './Skills';
import CompanyInfoInput from './CompanyInfoInput';
import './Home.css';

interface CompanyInfo {
    name: string;
    position: string;
}

interface HomeProps {
    setResult: Dispatch<SetStateAction<any>>;
}

const Home: React.FC<HomeProps> = ({ setResult }) => {
    const [fullName, setFullName] = useState<string>('');
    const [currentPosition, setCurrentPosition] = useState<string>('');
    const [currentLength, setCurrentLength] = useState<number>(1);
    const [headshot, setHeadshot] = useState<File | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([{ name: '', position: '' }]);
    const [skills, setSkills] = useState<string[]>([]);
    const navigate = useNavigate();

    const handleAddCompany = () => setCompanyInfo([...companyInfo, { name: '', position: '' }]);

    const handleRemoveCompany = (index: number) => {
        const list = [...companyInfo];
        list.splice(index, 1);
        setCompanyInfo(list);
    };

    const handleUpdateCompany = (e: ChangeEvent<HTMLInputElement>, index: number, field: string) => {
        const { value } = e.target;
        setCompanyInfo(prevCompanyInfo => {
            const updatedCompanyInfo = [...prevCompanyInfo];
            updatedCompanyInfo[index] = { ...updatedCompanyInfo[index], [field]: value };
            return updatedCompanyInfo;
        });
    };

    const handleAddSkill = (newSkill: string) => {
        if (skills.length < 5) {
            setSkills(prevSkills => [...prevSkills, newSkill]);
        } else {
            console.log("You can only add up to 5 skills.");
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // Append headshotImage only if a file is selected
        if (headshot) {
            formData.append('headshotImage', headshot as Blob, (headshot as File).name);
        }
    
        formData.append('fullName', fullName);
        formData.append('currentPosition', currentPosition);
        formData.append('currentLength', String(currentLength));
        formData.append('currentTechnologies', JSON.stringify(skills));
        formData.append('workHistory', JSON.stringify(companyInfo));
    
        try {
            const response = await axios.post('https://sturdy-winner-7wvw6xr9r4w2pr5x-4000.app.github.dev/resume/create', formData);
            setResult(response.data);
            navigate('/resume');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className="app-container">
            <div className="app">
                <header>
                    <h1><strong>Resume Builder</strong></h1>
                </header>
                <h1 className="subtitle"><strong>Generate a resume with AI in a few seconds</strong></h1>
                <form onSubmit={handleFormSubmit} method="POST" encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="fullName" className="label">Full Name</label>
                        <input
                            type="text"
                            required
                            name="fullName"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="currentPosition" className="label">Current Position</label>
                        <input
                            type="text"
                            required
                            name="currentPosition"
                            value={currentPosition}
                            onChange={(e) => setCurrentPosition(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="currentLength" className="label">Years of Experience</label>
                        <input
                            type="number"
                            required
                            name="currentLength"
                            value={currentLength.toString()}
                            onChange={(e) => setCurrentLength(Number(e.target.value))}
                            className="input-field"
                        />
                    </div>
                   <div><Skills skills={skills} setSkills={setSkills} handleAddSkill={(newSkill: string) => handleAddSkill(newSkill)} /></div>
                    <div className="form-group">
                        <label htmlFor="photo" className="label">Upload Headshot (optional)</label>
                        <input
                            type="file"
                            name="photo"
                            id="photo"
                            accept="image/x-png,image/jpeg"
                            onChange={(e) => setHeadshot(e.target.files?.[0] || null)}
                        />
                        <p className="optional-msg">* You can leave this blank if you don't want to upload a headshot.</p>
                    </div>
                    <h1><strong>Companies you've worked at</strong></h1>
                    {companyInfo.map((company, index) => (
                        <CompanyInfoInput
                            key={index}
                            company={company}
                            index={index}
                            handleUpdateCompany={handleUpdateCompany}
                            handleRemoveCompany={handleRemoveCompany}
                        />
                    ))}
                    <div className="button-group">
                        <button
                            type="button"
                            onClick={handleAddCompany}
                            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-r-lg mt-1"
                        >
                            Add
                        </button>
                    </div>
                    <button type="submit" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-r-lg mt-1">Create Resume</button>
                </form>
            </div>
        </div>
    );
};

export default Home;
