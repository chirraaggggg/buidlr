"use client"

import React, { useState } from 'react'
import PromptInput from '@/components/prompt-input'
import { Suggestion } from '@/components/ai-elements/suggestion'
import Header from './header'

type Props = {
    user: any;
}

const LandingSection = ({ user }: Props) => {
    const [promptText, setPromptText] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
    
    const suggestions = [
        { label: "Finance Tracker", value: "I want to design a personal finance tracker app" },
        { label: "Fitness Activity", value: "I want to design a fitness activity tracking app" },
        { label: "Food Delivery", value: "I want to design a food delivery app" },
        { label: "Travel Booking", value: "I want to design a travel booking app" },
        { label: "E-Commerce", value: "I want to design an e-commerce shopping app" },
        { label: "Meditation", value: "I want to design a meditation and wellness app" },
    ];

    const handleSuggestionClick = (value: string, label: string) => {
        setPromptText(value);
        setSelectedSuggestion(label);
    }

    const handleSubmit = () => {
        if (promptText.trim()) {
            setIsLoading(true);
            // Simulate processing
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }

  return (
    <div className='w-full min-h-screen bg-gradient-to-b from-background via-background to-primary/5'>
        <div className='flex flex-col'>
            <Header user={user} />
            <div className='relative overflow-hidden pt-20 md:pt-28'>
                <div className='max-w-6xl mx-auto flex flex-col items-center justify-center px-4'>
                    <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700'>
                        <h1 className='text-center font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight'>
                            Design mobile apps <br className='md:hidden' />
                            <span className='bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent'>
                                in minutes
                            </span>
                        </h1>
                        <p className='mx-auto max-w-2xl text-center font-medium text-foreground/80 leading-relaxed text-base sm:text-lg'>
                            Go from idea to beautiful app mockups in minutes by chatting with AI.
                        </p>
                    </div>
                    
                    <div className='flex w-full max-w-3xl flex-col items-center gap-8 relative z-50 mt-12'>
                        <div className='w-full animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100'>
                            <PromptInput 
                                className="ring-2 ring-primary/30 hover:ring-primary transition-all duration-300"
                                promptText={promptText}
                                setPromptText={setPromptText}
                                isLoading={isLoading}
                                onSubmit={handleSubmit}
                            />
                        </div>

                        <div className='flex flex-wrap justify-center gap-3 px-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 overflow-x-auto pb-2'>
                            {suggestions.map((s) => (
                                <Suggestion 
                                    key={s.label} 
                                    suggestion={s.label} 
                                    className={`text-sm! h-auto! px-4 py-2! rounded-full border border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer whitespace-nowrap flex-shrink-0 ${
                                        selectedSuggestion === s.label 
                                            ? 'ring-2 ring-primary bg-primary/10 border-primary/50' 
                                            : 'hover:bg-primary/5 hover:border-primary/40'
                                    }`}
                                    onClick={() => handleSuggestionClick(s.value, s.label)} 
                                >
                                    <span className='font-medium'>{s.label}</span>
                                </Suggestion>
                            ))}
                        </div>

                        <div className='text-center text-sm text-foreground/60 animate-in fade-in duration-700 delay-300'>
                            <p></p>
                        </div>
                    </div>

                    {/* Semi-circle line decoration */}
                    <div className='w-full h-40 pointer-events-none mt-2'>
                        <svg className='w-full h-full' viewBox='0 0 1200 200' preserveAspectRatio='none'>
                            <path 
                                d='M 0 200 Q 600 0 1200 200' 
                                stroke='hsl(var(--primary))' 
                                strokeWidth='4' 
                                fill='none'
                            />
                        </svg>
                    </div>

                    {/* Background gradient elements */}
                    <div className='absolute -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 w-[200vw] h-[200vw] rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none'>
                        <div className='-translate-x-1/2 absolute bottom-[calc(100%-300px)] left-1/2 h-[2000px] w-[2000px] opacity-15 bg-radial-primary'></div>
                        <div className='absolute -mt-2.5 size-full rounded-[50%] bg-primary/10 opacity-50 [box-shadow:0_-15px_24.8px_hsl(var(--primary)_/_0.3)]'></div>
                    </div>
                </div>
                <div className='w-full py-10'>
                    <div className='mx-auto max-w-3xl'>
                        <div>
                            <h1 className='font-medium text-xl tracking-tight'>Recent Projects</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LandingSection;