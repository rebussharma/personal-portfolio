export type TechTools = {
    name: string,
    src: string,
}

export type Project = {
    title: string,
    description: string,
    image: string,
    imageAlt: string,
    tags: string[],
    liveUrl: string,
    repoUrl: string,
}

export type Experience = {
    role: string,
    company: string,
    period: string,
    location?: string,
    highlights: string[],
}
