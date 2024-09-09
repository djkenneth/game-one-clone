
const generateSlug = (name: string) => {
    const slug = name.toLocaleLowerCase().replace(/ /g, '-');
    return slug;
}

export { generateSlug };