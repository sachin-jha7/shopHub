import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Admin() {

    const [previewUrl, setPriviewUrl] = useState(null);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const navigate = useNavigate();
    const selectedFiles = watch("file");
    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const objectUrl = URL.createObjectURL(file);
            setPriviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPriviewUrl(null)
        }
    }, [selectedFiles]);

    async function createNewProduct(data) {
        console.log(data);
        const formData = new FormData();
        formData.append("name", data.text);
        formData.append("price", data.number);
        formData.append("description", data.descp);
        formData.append("image", data.file[0])

        const res = await fetch("https://shophub-backend-hw2g.onrender.com/create", {
            method: "POST",
            body: formData,
            credentials: "include"
        });
        const result = await res.json();
        console.log(result);
        if (result == "Product created successfully") {
            navigate("/");
        }
    }

    return (
        <div className="admin-container">
            <div className="admin-wrapper">
                <h2>Add New Products</h2>
                <form className="admin-form" onSubmit={handleSubmit(createNewProduct)}>
                    <div className="form-element">
                        <input type="text" placeholder="Enter Product Name..." {
                            ...register("text", { required: "Product Name is required!" })
                        } />
                        {errors.text && (<p style={{ color: 'crimson', marginTop: '5px' }}>{errors.text.message}</p>)}
                    </div>
                    <div className="form-element">
                        <input type="number" placeholder="Enter Price..." min={1} {
                            ...register("number", {
                                required: "Price is required",
                                min: {
                                    value: 1,
                                    message: "Price must be at least $1"
                                }
                            })
                        } />
                        {errors.number && (<p style={{ color: 'crimson', marginTop: '5px' }}>{errors.number.message}</p>)}
                    </div>

                    <div className="form-element">
                        <textarea id="descp" placeholder="Write Description for the product..." {
                            ...register("descp", {
                                required: "Description is required"
                            })
                        } />
                        {errors.descp && (<p style={{ color: 'crimson', marginTop: '5px' }}>{errors.descp.message}</p>)}
                    </div>

                    <div className="form-element">
                        <input id="image" type="file" accept="image/*" hidden={true} {
                            ...register("file", {
                                required: "Please upload an image.",
                                validate: {
                                    hasFile: (files) => files?.length > 0 || "Image file is required."
                                }
                            })
                        } />
                        <label htmlFor="image" className="img-upload-btn">Upload Image</label>
                        {errors.file && (<p style={{ color: 'crimson', marginTop: '15px' }}>{errors.file.message}</p>)}
                    </div>
                    {
                        previewUrl && (
                            <img src={previewUrl} alt="img" />
                        )
                    }
                    <button className="btn btn-primary">Add to Product Grid</button>
                </form>
            </div>
        </div>
    )
}
