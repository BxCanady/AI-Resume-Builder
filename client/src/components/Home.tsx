import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import axios from 'axios';
import { Button, Input, Spacer } from '@nextui-org/react';

interface CompanyInfo {
    name: string;
    position: string;
}

const Home: React.FC<{ setResult: Function }> = ({ setResult }) => {
    const [fullName, setFullName] = useState<string>('');
    const [currentPosition, setCurrentPosition] = useState<string>('');
    const [currentLength, setCurrentLength] = useState<number>(1);
    const [currentTechnologies, setCurrentTechnologies] = useState<string>('');
    const [headshot, setHeadshot] = useState<File | null>(null);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([{ name: '', position: '' }]);
    const [loading, setLoading] = useState<boolean>(false);
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

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('headshotImage', headshot as Blob, (headshot as File).name);
        formData.append('fullName', fullName);
        formData.append('currentPosition', currentPosition);
        formData.append('currentLength', String(currentLength));
        formData.append('currentTechnologies', currentTechnologies);
        formData.append('workHistory', JSON.stringify(companyInfo));

        axios
            .post('http://localhost:4000/resume/create', formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data.data);
                    navigate('/resume');
                }
            })
            .catch((err) => console.error(err));
        setLoading(true);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app">
            <h1>Resume Builder</h1>
            <p>Generate a resume with ChatGPT in few seconds</p>
            <form onSubmit={handleFormSubmit} method="POST" encType="multipart/form-data">
                <label htmlFor="fullName">Enter your full name</label>
                <Input
                    type="text"
                    required
                    name="fullName"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <Spacer y={1} />
                <div>
                    <label htmlFor="currentPosition">Current Position</label>
                    <Input
                        type="text"
                        required
                        name="currentPosition"
                        className="currentInput"
                        value={currentPosition}
                        onChange={(e) => setCurrentPosition(e.target.value)}
                    />
                </div>
                <Spacer y={1} />
                <div>
                    <label htmlFor="currentLength">For how long? (year)</label>
                    <Input
                        type="number"
                        required
                        name="currentLength"
                        className="currentInput"
                        value={currentLength.toString()}
                        onChange={(e) => setCurrentLength(Number(e.target.value))}
                    />
                </div>
                <Spacer y={1} />
                <div>
                    <label htmlFor="currentTechnologies">Technologies used</label>
                    <Input
                        type="text"
                        required
                        name="currentTechnologies"
                        className="currentInput"
                        value={currentTechnologies}
                        onChange={(e) => setCurrentTechnologies(e.target.value)}
                    />
                </div>
                <Spacer y={2} />
                <label htmlFor="photo">Upload your headshot image</label>
                <input
                    type="file"
                    name="photo"
                    required
                    id="photo"
                    accept="image/x-png,image/jpeg"
                    onChange={(e) => setHeadshot(e.target.files?.[0] || null)}
                />


                <h3>Companies you've worked at</h3>

                {companyInfo.map((company, index) => (
                    <div key={index}>
                        <div className="companies">
                            <label htmlFor="name">Company Name</label>
                            <Input
                                type="text"
                                name="name"
                                required
                                onChange={(e) => handleUpdateCompany(e, index)}
                            />
                        </div>
                        <Spacer y={1} />
                        <div className="companies">
                            <label htmlFor="position">Position Held</label>
                            <Input
                                type="text"
                                name="position"
                                required
                                onChange={(e) => handleUpdateCompany(e, index)}
                            />
                        </div>
                        <Spacer y={1} />
                        <div className="btn__group">
                            {companyInfo.length - 1 === index && companyInfo.length < 4 && (
                                <Button id="addBtn" onClick={handleAddCompany}>
                                    Add
                                </Button>
                            )}
                            {companyInfo.length > 1 && (
                                <Button id="deleteBtn" onClick={() => handleRemoveCompany(index)}>
                                    Del
                                </Button>
                            )}
                        </div>
                        <Spacer y={2} />
                    </div>
                ))}

                <Button type="submit">CREATE RESUME</Button>
            </form>
        </div>
    );
};

export default Home;
