import { useEffect, useState } from "react"
import "./Roadmap.css"
import type { topicGeneralType } from "../../types/topicType"
import { getTopics } from "../../services/singlePlayApiService"
import type { ApiResponse } from "../../types/apiType"
import { useNavigate } from "react-router-dom"
export const Roadmap: React.FC = () => {
    const [topicsList , setTopicsList] = useState<topicGeneralType[]>([])
    const navigate = useNavigate()

    useEffect(()=>{
        const getTopicsList = async () => {
            const result:ApiResponse<topicGeneralType[]> = await getTopics();
            if(result.data){
                setTopicsList(result.data)
            }
        }
        getTopicsList();
    },[])

    return (
        <div className="rm_container">
            <div className="rm_background"/>
            <div className="topic_card_list">
                {
                    topicsList.length != 0 ? 
                    topicsList.map(item=>(
                        <div key={item.id} className={`topic_card disabled`} onClick={()=>{navigate(`/v1/adventure/${item.id}`)}}>
                            {/*<div className="lock_icon">
                                <i className="fi fi-rr-lock"></i>
                            </div>*/}
                            <h3>Chương {item.indexOrder}</h3>
                            <p>{item.description !== "" ? item.description : "Không có mô tả"}</p>
                            <p>Số màn: {item.quests.length}</p>
                        </div>
                    )) :
                    <div className="topic_card">

                    </div>
                }
            </div>
        </div>
    )
}