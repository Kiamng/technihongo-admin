"use client";
import React from "react";
import { Calendar } from "lucide-react";
import { Course } from "@/types/course";

interface CourseCardsProps {
    course: Course;
}

const CourseCards: React.FC<CourseCardsProps> = ({
    course,
}) => {

    const generateBackgroundColor = (title: string) => {
        let hash = 0;

        for (let i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;

        return `hsl(${hue}, 85%, 75%)`;
    };

    const getCourseInitials = (title: string) => {
        return title
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };
    return (
        <div
            key={course.courseId.toString()}
            className="bg-white border flex flex-col h-full hover:shadow-lg overflow-hidden rounded-xl shadow-md transform"
        >
            <div className="flex h-52 items-center justify-center overflow-hidden relative w-full group">
                {course.thumbnailUrl ? (
                    <img
                        alt={course.title}
                        className="h-full object-cover transition-transform duration-500 group-hover:scale-110 w-full"
                        src={course.thumbnailUrl}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;

                            target.onerror = null;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLDivElement;

                            fallback.style.display = "flex";
                        }}
                    />
                ) : null}

                <div
                    className="absolute flex font-bold group-hover:scale-110 inset-0 items-center justify-center text-5xl text-white transition-transform duration-500"
                    style={{
                        backgroundColor: generateBackgroundColor(course.title),
                        display: course.thumbnailUrl ? "none" : "flex",
                    }}
                >
                    {getCourseInitials(course.title)}
                </div>

                {/* Updated Difficulty Level Tag */}
                <div className="absolute bg-[#56D071] font-bold px-4 py-1.5 right-3 rounded-full text-white text-xs top-3 shadow-md">
                    {course.difficultyLevel.tag}
                </div>
            </div>

            <div className="flex flex-col flex-grow p-5">
                <h3 className="font-bold line-clamp-2 mb-3 min-h-14 text-gray-800 text-xl">
                    {course.title}
                </h3>

                <p className="line-clamp-2 mb-4 text-gray-600 text-sm">
                    {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#e9f7ed] font-medium px-3 py-1 rounded-full text-[#56D071] text-xs">
                        {course.domain.tag}
                    </span>
                    <span className="bg-[#f0f8f3] font-medium px-3 py-1 rounded-full text-[#459a58] text-xs">
                        {course.domain.name}
                    </span>
                </div>

                <div className="flex items-center mb-5 text-gray-700 text-sm">
                    <Calendar className="flex-shrink-0 mr-2 text-[#56D071]" size={16} />
                    <span>{course.estimatedDuration}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCards;
