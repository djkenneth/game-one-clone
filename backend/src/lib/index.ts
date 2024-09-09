
const generateSlug = async (name: string): Promise<string> => {
    const slug = name.toLocaleLowerCase().replace(/ /g, '-');
    return slug;
}

export { generateSlug };