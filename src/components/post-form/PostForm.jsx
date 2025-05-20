import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import databaseService from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addPost, updatePost } from "../../store/postSlice";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (post) {
            // Update existing post
            const file = data.image[0] ? await databaseService.uploadFile(data.image[0]) : null;
    
            if (file) {
                // Delete old featured image if a new one is uploaded
                databaseService.deleteFile(post.featuredImage);
            }
    
            const dbPost = await databaseService.updatePost(post.$id, {
                title: data.title,
                slug: data.slug,
                content: data.content,
                featuredImage: file ? file.$id : post.featuredImage,
                status: data.status
            });
    
            if (dbPost) {
                // Update post in global state
                dispatch(updatePost(dbPost));
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            // Create new post
            const file = await databaseService.uploadFile(data.image[0]);
    
            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await databaseService.createPost({ 
                    ...data, 
                    userId: userData.$id 
                });
    
                if (dbPost) {
                    // Add post to global state
                    dispatch(addPost(dbPost));
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };
    
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Content) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Article Details
                    </h3>
                    
                    <div className="mb-6">
                        <Input
                            label="Title"
                            placeholder="Enter a compelling title..."
                            className="mb-4 focus:ring-blue-500"
                            {...register("title", { required: true })}
                        />
                        
                        <div className="flex items-center mb-1 mt-5">
                            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mr-2">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                            </div>
                            <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                        </div>
                        
                        <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                yourdomain.com/post/
                            </span>
                            <Input
                                placeholder="your-post-slug"
                                className="rounded-l-none focus:ring-blue-500"
                                {...register("slug", { required: true })}
                                onInput={(e) => {
                                    setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                }}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                        </svg>
                        Article Content
                    </h3>
                    <RTE 
                        label="Write your post here" 
                        name="content" 
                        control={control} 
                        defaultValue={getValues("content")} 
                    />
                </div>
            </div>
            
            {/* Right Column (Settings) */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Publish Settings
                    </h3>
                    
                    <div className="mb-6">
                        <Select
                            options={["active", "inactive"]}
                            label="Article Status"
                            className="w-full mb-4 focus:ring-blue-500"
                            {...register("status", { required: true })}
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        bgColor={post ? "bg-green-600" : "bg-blue-600"} 
                        className="w-full hover:shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                            </svg>
                            {post ? "Update Article" : "Publish Article"}
                        </div>
                    </Button>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Featured Image
                    </h3>
                    
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            className="sr-only"
                                            type="file"
                                            accept="image/png, image/jpg, image/jpeg, image/gif"
                                            {...register("image", { required: !post })}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {post && (
                        <div className="w-full mt-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Current Image
                            </label>
                            <img
                                src={databaseService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}