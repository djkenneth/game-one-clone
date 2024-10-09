function Image({ src }: any) {
    return (
        <div className="relative overflow-hidden h-full">
            <div className="absolute top-1/2 left-1/2 w-[110%]" style={{ transform: 'translate3d(-50%,-50%,0)' }}>
                <img src={src} className="w-full" />
            </div>
        </div>
    )
}

export default Image