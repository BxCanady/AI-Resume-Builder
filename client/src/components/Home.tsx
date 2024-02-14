import React, { useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

    const handleUpdateCompany = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const list = [...companyInfo];
        list[index][name as keyof CompanyInfo] = value;
        setCompanyInfo(list);
    };

    const handleAddSkill = () => {
        if (skills.length < 5) {
            const newSkill = ''; // Replace '' with the value entered for the new skill
            if (newSkill.trim() !== '') {
                setSkills(prevSkills => [...prevSkills, newSkill]);
            }
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('headshotImage', headshot as Blob, (headshot as File).name);
        formData.append('fullName', fullName);
        formData.append('currentPosition', currentPosition);
        formData.append('currentLength', String(currentLength));
        formData.append('currentTechnologies', JSON.stringify(skills));
        formData.append('workHistory', JSON.stringify(companyInfo));

        axios
            .post('http://localhost:4000/resume/create', formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data); // Pass result data to setResult
                    navigate('/resume');
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="app-container">
            <div className="app">
                <h1 style={{ textAlign: "center" }}>Resume Builder</h1>
                <form onSubmit={handleFormSubmit} method="POST" encType="multipart/form-data">
                    <label htmlFor="fullName" className="label">Enter your full name</label>
                    <input
                        type="text"
                        required
                        name="fullName"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field"
                    />
                    <div className="mb-4">
                        <label htmlFor="currentPosition" className="block mb-2">Current Position</label>
                        <input
                            type="text"
                            className="border border-pearl-blue rounded-lg px-4 py-2 w-full"
                            name="currentPosition"
                            value={currentPosition}
                            onChange={(e) => setCurrentPosition(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="currentLength" className="block mb-2">For how long? (year)</label>
                        <input
                            type="number"
                            className="border border-pearl-blue rounded-lg px-4 py-2 w-full"
                            name="currentLength"
                            value={currentLength.toString()}
                            onChange={(e) => setCurrentLength(Number(e.target.value))}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="currentTechnologies" className="block mb-2">Enter up to <strong>5 skills</strong></label>
                        <div className="flex">
                            <input
                                type="text"
                                className="border border-pearl-blue rounded-l-lg px-4 py-2 flex-1"
                                name="skills"
                                value={skills.join(',')} // Join skills array to display comma-separated values
                                onChange={(e) => setSkills(e.target.value.split(','))} // Split value back to array
                            />
                            <button
                                type="button"
                                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-r-lg"
                                onClick={handleAddSkill}
                            >
                                Add Skill
                            </button>
                        </div>
                    </div>
                    <label htmlFor="photo" className="block mb-2">Upload your headshot image (optional)</label>
                    <input
                        type="file"
                        name="photo"
                        id="photo"
                        accept="image/x-png,image/jpeg"
                        onChange={(e) => setHeadshot(e.target.files?.[0] || null)}
                    />
                    <p className="optional-msg">* You can leave this blank if you don't want to upload a headshot.</p>
                    <h3 className="text-2xl mb-4">Companies you've worked at</h3>
                    {companyInfo.map((company, index) => (
                        <div key={index} className="mb-4">
                            <div className="mb-4">
                                <label htmlFor="name" className="block mb-2">Company Name</label>
                                <input
                                    type="text"
                                    className="border border-pearl-blue rounded-lg px-4 py-2 w-full"
                                    name="name"
                                    required
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="position" className="block mb-2">Position Held</label>
                                <input
                                    type="text"
                                    className="border border-pearl-blue rounded-lg px-4 py-2 w-full"
                                    name="position"
                                    required
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className="flex">
                                <button
                                    type="button"
                                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg mr-2"
                                    onClick={() => handleRemoveCompany(index)}
                                >
                                    Delete
                                </button>
                                {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                                    <button
                                        type="button"
                                        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddCompany}
                                    >
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-lg"
                    >
                        CREATE RESUME
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
