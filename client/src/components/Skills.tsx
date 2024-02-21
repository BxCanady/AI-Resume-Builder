import React, { useState } from 'react';

interface SkillsProps {
    skills: string[];
    setSkills: React.Dispatch<React.SetStateAction<string[]>>;
    handleAddSkill: (newSkill: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ skills, setSkills, handleAddSkill }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSkill(e.target.value);
    };

    const addSkill = () => {
        if (newSkill.trim() !== '' && skills.length < 5) {
            handleAddSkill(newSkill);
            setNewSkill(''); // Clear the input field after adding the skill
        }
    };

    const removeSkill = (index: number) => {
        setSkills(prevSkills => prevSkills.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-4">
            <label htmlFor="currentTechnologies" className="block mb-2">Enter up to <strong>5 skills</strong></label>
            <div className="relative">
                <input
                    type="text"
                    className="border border-pearl-blue rounded-l-lg px-4 py-2 w-full"
                    name="skills"
                    value={newSkill}
                    onChange={handleInputChange}
                />
                <div className="absolute top-full left-0 w-full mt-1">
                    {skills.map((skill, index) => (
                        <div key={index} className="inline-block bg-gray-200 rounded-lg px-3 py-1 m-1">
                            <span>{skill}</span>
                            <button onClick={() => removeSkill(index)} className="ml-2 text-red-600">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white px-4 py-2 rounded-r-lg mt-1"
                    onClick={addSkill}
                >
                    Add Skill
                </button>
            </div>
        </div>
    );
};

export default Skills;
