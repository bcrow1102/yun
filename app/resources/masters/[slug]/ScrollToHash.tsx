"use client";

import { useEffect } from "react";

export default function ScrollToHash() {
    useEffect(() => {
        if (window.location.hash !== "#videos") return;

        const scrollToVideos = () => {
            document.getElementById("videos")?.scrollIntoView({
                block: "start",
                behavior: "auto",
            });
        };

        scrollToVideos();

        const timer = window.setTimeout(scrollToVideos, 300);

        return () => window.clearTimeout(timer);
    }, []);

    return null;
}