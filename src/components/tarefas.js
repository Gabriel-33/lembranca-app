import {useMemo,useState,useEffect } from "react";
import axios from 'axios'
import moment from 'moment';
import { useForm } from "react-hook-form";
import shortid from 'shortid';

export const ListarTarefas =(lembrancaObj,tarefasLoad,SetLembrancaObj,setTarefasLoad) =>{
    useMemo(() =>{  
        if (lembrancaObj.length === 0 && tarefasLoad === 0) {
            axios.post('http://localhost:8080/listarLembracas').then((res)=>{
                /* console.log(res.data) */
                const itemLength = res.data.length;
                for(let i = (itemLength-1); i >= 0; i--){
                    SetLembrancaObj((prevItems) => prevItems.concat(res.data[i]));
                }
            });
            setTarefasLoad(1);
        }
    },[]);
}

const excluirLembranca = async(SetLembrancaObj,lembrancaObj,key,SetEditing)=>{
    
    const shortId = lembrancaObj[key].shortId;
    SetEditing(false)
    await axios.post('http://localhost:8080/excluirLembranca',{
        shortId:shortId
    });

    SetLembrancaObj((prevArray) => {
        const newArray = [...prevArray];
        newArray.splice(key, 1);
        return newArray;
    });
}
export const TarefasCard = (props) =>{
    const [isVisible, setIsVisible] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();
    const onSubmit = async(dataForm) => {
        setIsVisible(true)
        const ramdomId = shortid.generate();
        const ext = dataForm.ImgCaminho.split('.').pop();
        const imgName = ramdomId+"."+ext;
        let img = "";
        
        if(dataForm.ImgLembranca.length !== 0){
            const formData = new FormData();
            formData.append("fileName",String(imgName));
            formData.append("shortId",dataForm.shortId);
            formData.append("image",dataForm.ImgLembranca[0]);
            await axios.post('http://localhost:8080/uploadImage',formData).then((res)=>{
                if(res.data.message !== true){
                    alert(res.data.message)
                    img = dataForm.ImgCaminho
                }else{
                    img = imgName
                }
            });
        }else{
            img = dataForm.ImgCaminho
        }
        const addLembranca = {
            'shortId':dataForm.shortId,
            'lembranca':dataForm.Lembranca,
            'dataLembranca':dataForm.DataLembranca,
            'textoLembranca':dataForm.TextoLembranca,
            'imgLembranca':img
        };

        props.SetEditing(false)
        setIsVisible(false)
        await axios.post('http://localhost:8080/atualizarLembranca',addLembranca).then((res)=>{
            /* console.log(res) */
        });

        await props.SetLembrancaObj(prevItems => prevItems.map((item, i) => {
            const key = parseInt(dataForm.key)
            if (i === key) {
                return {...addLembranca};
            }
            return item;
        }));
        reset();
    }
    const editar = (key)=>{
        /* console.log(key) */
        reset()
        props.SetEditing(key);
    }
    return(
        <div className="lembranca card">
            <div className="container">
                <div className="row">   
                    {Object.entries(props.lembrancaObj).map(([key,value]) =>(
                        <div className="cards col-md-4" key={key}>  
                            {props.editing === key ? (
                                <div className="card h-100">
                                    <div className="carregando"> 
                                        <div className="spinner-border text-success" role="status" style={{display: isVisible ? 'block':'none'}}> 
                                        </div>
                                    </div>
                                    <img src={require('./../img/'+value.imgLembranca)} alt="..." className="img-fluid"></img>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <input type="hidden" {...register("shortId", { required: true})} value={value.shortId}></input>
                                            <input type="hidden" {...register("key", { required: true})} value={key}></input>
                                            <div className="col">
                                                <input className="form-control" type="text" defaultValue={value.lembranca} {...register("Lembranca", { required: true})} autoComplete="off" maxLength={30}/>
                                                {errors.Lembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                            </div>  
                                            <br></br>

                                            <div className="col">
                                                <input type="date" className="form-control" defaultValue={moment(value.dataLembranca).format("YYYY-MM-DD")}{...register("DataLembranca",{required:true})} autoComplete="off"></input>
                                                {errors.DataLembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                            </div>
                                            <br></br>

                                            <textarea className="form-control" defaultValue={value.textoLembranca} {...register("TextoLembranca",{required:true})} autoComplete="off" maxLength={150}></textarea>
                                            {errors.TextoLembranca && <p className="text text-danger">*Campo obrigatório!</p>}
                                            <br></br>
                                            <input type="hidden" className="form-control" {...register("ImgCaminho",{value:value.imgLembranca})}></input>
                                            <input type="file" className="form-control" {...register("ImgLembranca")}></input>
                                            <br></br>
                                            <div className="d-grid gap-2">
                                                <button className="btn btn-success" type="submit">Alterar</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ):(
                                <div className="card h-100">
                                    <img src={require('./../img/'+value.imgLembranca)} alt="..." className="img-card img-fluid" onClick={() => editar(key)}></img>
                                    <div className="card-body h-100">
                                        <h5 className="card-title">{value.lembranca}</h5>
                                        <p className="card-text">{moment(value.dataLembranca).format("DD-MM-YYYY")}</p>
                                        <p className="card-text">{value.textoLembranca}</p>
                                        <button className="btn btn-danger" onClick={() => excluirLembranca(props.SetLembrancaObj,props.lembrancaObj,key,props.SetEditing)}>Excluir</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
