import {TarefasCard,ListarTarefas} from "./tarefas.js"
import { useState } from "react";
export const Lembrancas = () =>{
    const [lembrancaObj,SetLembrancaObj] = useState([]);
    const [tarefasLoad, setTarefasLoad] = useState(0);
    ListarTarefas(lembrancaObj,tarefasLoad,SetLembrancaObj,setTarefasLoad)
    return(
        <>
            <TarefasCard lembrancaObj={lembrancaObj} SetLembrancaObj={SetLembrancaObj}></TarefasCard>
        </>
    );
};