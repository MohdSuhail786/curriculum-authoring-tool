import { atom } from "recoil";
import { IMSubject, Subject } from "../models/Subject";
import { data } from "../constants/Constants";

export const subjectAtom = atom<Subject | null>({
    key: 'subjectAtomKey',
    default: null,
})

export const imSubjectAtom = atom<IMSubject | null>({
    key: 'imSubjectAtom',
    default: data,
})  