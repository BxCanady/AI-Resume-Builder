import React, { useRef } from "react";
import ErrorPage from "./ErrorPage";
import { useReactToPrint } from "react-to-print";

interface ResumeProps {
    result: {
        fullName: string;
        currentPosition: string;
        currentTechnologies: string;
        currentLength: number;
        image_url: string;
        objective: string;
        workHistory: WorkHistoryItem[]; // Define this type
        // Add other properties as needed
    };
}

interface WorkHistoryItem {
    name: string;
    position: string;
    // Add other properties as needed
}

const Resume: React.FC<ResumeProps> = ({ result }) => {
    const componentRef = useRef<HTMLElement | null>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${result.fullName} Resume`,
        onAfterPrint: () => alert("Print Successful!"),
    });

    if (JSON.stringify(result) === "{}") {
        return <ErrorPage />;
    }

    const replaceWithBr = (string: string) => {
        return string.replace(/\n/g, "<br />");
    };

    return (
        <>
            <button onClick={handlePrint}>Print Page</button>
            <main className='container' ref={componentRef}>
                <header className='header'>
                    <div>
                        <h1>{result.fullName}</h1>
                        <p className='resumeTitle headerTitle'>
                            {result.currentPosition} ({result.currentTechnologies})
                        </p>
                        <p className='resumeTitle'>
                            {result.currentLength} year(s) work experience
                        </p>
                    </div>
                    <div>
                        <img
                            src={result.image_url}
                            alt={result.fullName}
                            className='resumeImage'
                        />
                    </div>
                </header>
                <div className='resumeBody'>
                    <div>
                        <h2 className='resumeBodyTitle'>PROFILE SUMMARY</h2>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: replaceWithBr(result.objective),
                            }}
                            className='resumeBodyContent'
                        />
                    </div>
                    <div>
                        <h2 className='resumeBodyTitle'>WORK HISTORY</h2>
                        {result.workHistory.map((work: WorkHistoryItem) => (
                            <p className='resumeBodyContent' key={work.name}>
                                <span style={{ fontWeight: "bold" }}>{work.name}</span> -{" "}
                                {work.position}
                                {/* Add more details about each work history item */}
                            </p>
                        ))}
                        {/* Add other sections (education, skills, etc.) similarly */}
                    </div>
                </div>
            </main>
        </>
    );
};

export default Resume;