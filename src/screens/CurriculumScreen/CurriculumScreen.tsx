import CurriculumHeader from "../../components/curriculum/CurriculumHeader/CurriculumHeader"
import "./CurriculumScreen.scss"
import { useEffect } from "react"
import { Subject } from "../../models/Subject"
import CurriculumBody from "../../components/curriculum/CurriculumBody/CurriculumBody"
import { useRecoilValue } from "recoil"
import { imSubjectAtom } from "../../state/state"
import { ActionStore } from "../../actions/store/ActionStore"

export default function CurriculumScreen() {
    const imSubject = useRecoilValue(imSubjectAtom)

    useEffect(() => {
        if (!imSubject) return;
        new Subject(imSubject);
        return () => ActionStore.reset()
    }, [imSubject]);

    return (
        <div className="curriculum">
            <CurriculumHeader />
            <CurriculumBody />
        </div>
    )
}