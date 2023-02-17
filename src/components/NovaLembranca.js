import { useState,useEffect } from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";
import shortid from 'shortid';

import { ListarTarefas,TarefasCard } from "./tarefas";

export const NovaLembranca =() =>{
    const [NovaLembranca,setNovaLembranca] = useState([]);
    const [lembrancaObj,SetLembrancaObj] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [tarefasLoad, setTarefasLoad] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    let [retorno, setRetorno] = useState('');
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
      } = useForm();

    ListarTarefas(lembrancaObj,tarefasLoad,SetLembrancaObj,setTarefasLoad);

    const onSubmit = async(dataForm,event) => {
        const ramdomId = shortid.generate();
        const ext = dataForm.ImgLembranca[0].name.split('.').pop();
        const imgName = ramdomId+"."+ext;
        const addLembranca = {
            'shortId':ramdomId,
            'lembranca':dataForm.Lembranca,
            'dataLembranca':dataForm.DataLembranca,
            'textoLembranca':dataForm.TextoLembranca,
            'imgLembranca':imgName
        };
        setNovaLembranca(addLembranca);
        const formData = new FormData();
        formData.append("fileName",String(imgName));
        formData.append("shortId",ramdomId);
        formData.append("lembranca",dataForm.Lembranca);
        formData.append("dataLembranca",dataForm.DataLembranca);
        formData.append("textoLembranca",dataForm.TextoLembranca);
        formData.append("image",dataForm.ImgLembranca[0]);
        
        setIsVisible(true);
        await axios.post('http://localhost:8080/cadastrarLembranca',formData).then((res)=>{
            if(res.data.message === true){
                setRetorno(res.data.message)
            }else{
                alert(res.data.message);
            }
        });
        console.log()
        setSubmitting(true)
    }
    
    useEffect(()=>{
        if(submitting === true){            
            if(retorno === true){
                SetLembrancaObj([NovaLembranca,...lembrancaObj]);
            } 
        }
        setRetorno(false);
        setSubmitting(false)
        setIsVisible(false)
        reset();
    },[NovaLembranca,submitting])
    return(
        <>
            <div className="formulario">
                <div className="card">
                    <div className="carregando"> 
                        <div className="spinner-border text-success" role="status" style={{display: isVisible ? 'block':'none'}}> 
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-row">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="col">
                                    <label className="labelFormularioTarefa">Adicione uma lembraça:</label>
                                    <input className="form-control" {...register("Lembranca", { required: true })} autoComplete="off" maxLength={30}/>
                                    {errors.Lembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                    
                                </div>
                                <div className="col">
                                    <label className="labelFormularioTarefa">Data da lembraça:</label>
                                    <input type="date" className="form-control"{...register("DataLembranca",{required:true})} autoComplete="off"></input>
                                    {errors.DataLembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                    
                                </div>
                                <label className="labelFormularioTarefa">Texto lembraça:</label>
                                <textarea className="form-control" {...register("TextoLembranca",{required:true})} autoComplete="off" maxLength={150}></textarea>
                                {errors.TextoLembranca && <p className="text text-danger">*Campo obrigatório!</p>}

                                <label className="labelFormularioTarefa">Imagem da lembraça:</label>
                                <input type="file" className="form-control" {...register("ImgLembranca",{required:true})}></input>
                                {errors.ImgLembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                <br></br>
                                <div className="d-grid gap-2">
                                    <input type="submit" className="btn btn-primary"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <TarefasCard lembrancaObj={lembrancaObj} SetLembrancaObj={SetLembrancaObj} NovaLembranca={NovaLembranca}></TarefasCard>
        </>
    );
};