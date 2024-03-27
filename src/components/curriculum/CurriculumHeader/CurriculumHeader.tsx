import Button from "../../common/Button/Button"
import { FaArrowDown } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";
import "./CurriculumHeader.scss"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imSubjectAtom, subjectAtom } from "../../../state/state";
import { ChangeEvent } from "react";
import { IMSubject } from "../../../models/Subject";
import { ActionStore } from "../../../actions/store/ActionStore";

export default function CurriculumHeader() {
    const subject = useRecoilValue(subjectAtom)
    const setIMSubject = useSetRecoilState(imSubjectAtom)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const { name } = e.target.files[0];
        if (name.endsWith(".json")) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                try {
                    const rawJSON = e?.target?.result;
                    const parsedJSON = JSON.parse(rawJSON as string)
                    setIMSubject(parsedJSON as unknown as IMSubject)
                } catch (error) {
                    alert("Invalid JSON file")
                }
            };

            reader.readAsText(e.target.files[0]);
        } else {
            alert("File type not supported. \n\nSupported files : .json")
        }
    };

    return (
        <div className="header">
            <div className="header-item">
                <Button onClick={() => ActionStore.undo()}>Undo</Button>
                <Button onClick={() => ActionStore.redo()}>Redo</Button>
            </div>
            <div className="header-item">
                <label htmlFor="upload-json"><Button disabled={!subject}>Upload JSON <FiUpload /></Button></label>
                <input
                    id="upload-json"
                    type="file"
                    name="JSONFile"
                    onChange={handleFileChange}
                />

                <Button disabled={!subject} variation="danger" onClick={() => subject?.downloadIMFile()}>Download JSON <FaArrowDown /></Button>
            </div>
        </div>
    )
}