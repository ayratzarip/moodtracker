interface VimeoEmbedProps {
  videoId: string;
}

const VimeoEmbed = ({ videoId }: VimeoEmbedProps) => {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={`https://player.vimeo.com/video/${videoId}`}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Инструкция по использованию"
      />
    </div>
  );
};

export default VimeoEmbed;
