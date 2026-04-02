export interface questGeneralType{
    id:string,
    type:string,
    title:string,
    status:boolean,
    description:string,
    questNum:number,
    indexOrder:number,
    lessons: Array<any>,
    questions: Array<any>,
    rewards: Array<any>
}

export interface topicGeneralType{
    id:string,
    title:string,
    status:boolean,
    description:string,
    indexOrder:number,
    quests:Array<any>
}

export interface QuestStatusDto{
    completed: boolean,
    quest: questGeneralType,
    unlocked: boolean,
}