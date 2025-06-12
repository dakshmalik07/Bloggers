import React, { useCallback, useState, useEffect } from "react";
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
    
    // UI state for animations
    const [isVisible, setIsVisible] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        // Calculate initial word count
        const content = getValues("content");
        if (content) {
            setWordCount(content.split(/\s+/).filter(word => word.length > 0).length);
        }
    }, [getValues]);

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
            if (name === "content") {
                setWordCount(value.content ? value.content.split(/\s+/).filter(word => word.length > 0).length : 0);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            // Create a new FileList-like object for react-hook-form
            const dt = new DataTransfer();
            dt.items.add(e.dataTransfer.files[0]);
            document.getElementById("file-upload").files = dt.files;
        }
    };

    return (
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Word Count Badge */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-6 py-2">
                        <span className="text-purple-400 text-sm font-medium">
                            {wordCount} words • {Math.ceil(wordCount / 200)} min read
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Auto-saving enabled
                </div>
            </div>

            <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Content) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Article Details */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6 flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </div>
                                Article Details
                            </h3>
                        
                            <div className="mb-6">
                                <div className="relative">
                                    <Input
                                        label="Title"
                                        placeholder="Enter a compelling title..."
                                        className="mb-4 bg-slate-800/50 border-slate-600/50 text-black placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl"
                                        {...register("title", { required: true })}
                                    />
                                </div>
                                
                                <div className="flex items-center mb-2 mt-6">
                                    <div className="flex-shrink-0 w-5 h-5 text-purple-400 mr-3">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                        </svg>
                                    </div>
                                    <label className="block text-lg font-semibold text-white">URL Slug</label>
                                </div>
                                
                                <div className="flex rounded-xl shadow-lg overflow-hidden border border-slate-600/50 focus-within:border-purple-500 transition-colors duration-300">
                                    <span className="inline-flex items-center px-6 bg-slate-800/70 text-purple-300 text-sm font-medium">
                                        yourdomain.com/post/
                                    </span>
                                    <Input
                                        placeholder="your-post-slug"
                                        className="rounded-none border-0 bg-slate-900/50 text-black placeholder-slate-400 focus:ring-0"
                                        {...register("slug", { required: true })}
                                        onInput={(e) => {
                                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Article Content */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6 flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                                    </svg>
                                </div>
                                Article Content
                            </h3>
                            <div className="mb-6">
                                <RTE 
                                    label="Write your post here" 
                                    name="content" 
                                    control={control} 
                                    defaultValue={getValues("content")} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Column (Settings) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Publish Settings */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-6 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                </div>
                                Publish Settings
                            </h3>
                            
                            <div className="mb-6">
                                <Select
                                    options={["active", "inactive"]}
                                    label="Article Status"
                                    className="w-full mb-6 bg-slate-800/50 border-slate-600/50 text-black focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                                    {...register("status", { required: true })}
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                bgColor={post ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-purple-500 to-pink-500"} 
                                className="w-full hover:shadow-2xl hover:shadow-purple-500/25 transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 rounded-xl py-4 font-semibold text-lg"
                            >
                                <div className="flex items-center justify-center">
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                    </svg>
                                    {post ? "✨ Update Article" : "🚀 Publish Article"}
                                </div>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Featured Image */}
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent mb-6 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                Featured Image
                            </h3>
                            
                            <div className="mb-4">
                                <label className="block mb-4 text-sm font-medium text-slate-300">
                                    Upload Image
                                </label>
                                <div 
                                    className={`relative flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                                        dragActive 
                                            ? 'border-pink-400 bg-pink-500/10 scale-105' 
                                            : 'border-slate-600/50 hover:border-pink-400/50 hover:bg-slate-800/30'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-4 text-center">
                                        <div className="text-6xl">
                                            {dragActive ? '🎯' : '📸'}
                                        </div>
                                        <div className="flex text-sm text-slate-300">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-bold hover:from-pink-400 hover:to-orange-400 transition-all duration-300">
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
                                        <p className="text-xs text-slate-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>

                   
                </div>
            </form>
        </div>
    );
}