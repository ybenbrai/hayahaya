"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Globe,
  Monitor,
} from "lucide-react";
import { StreamInfo } from "@/types";
import { useState, useRef, useEffect } from "react";

interface VideoPlayerProps {
  streams: StreamInfo[];
}

export function VideoPlayer({ streams }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStream, setCurrentStream] = useState<StreamInfo | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showStreamSelector, setShowStreamSelector] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (streams.length > 0) {
      setCurrentStream(streams[0]);
    }
  }, [streams]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleStreamSelect = (stream: StreamInfo) => {
    setCurrentStream(stream);
    setShowStreamSelector(false);
    setIsPlaying(false);
  };

  const getStreamIcon = (type: string) => {
    switch (type) {
      case "hls":
        return <Monitor className="h-4 w-4" />;
      case "youtube":
        return <Play className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "4k":
        return "bg-purple-500";
      case "hd":
        return "bg-green-500";
      case "sd":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!currentStream) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <CardContent className="text-center">
          <div className="text-muted-foreground">No streams available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-black">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-96 object-cover"
            poster={currentStream.fallbackImage}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onMouseMove={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <source src={currentStream.url} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>

          {/* Fallback Image */}
          {!isPlaying && (
            <div
              className="absolute inset-0 bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${currentStream.fallbackImage})` }}
            >
              <div className="bg-black/50 rounded-lg p-8 text-center text-white">
                <div className="text-2xl font-bold mb-2">Match Coverage</div>
                <div className="text-sm opacity-75">
                  Click play to start streaming
                </div>
              </div>
            </div>
          )}

          {/* Stream Info Overlay */}
          <div className="absolute top-4 left-4 flex space-x-2">
            {currentStream.isLive && (
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={getQualityColor(currentStream.quality)}
            >
              {currentStream.quality.toUpperCase()}
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/50 text-white border-white/20"
            >
              {currentStream.language}
            </Badge>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showControls ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStreamSelector(!showStreamSelector)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => videoRef.current?.requestFullscreen()}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stream Selector */}
          {showStreamSelector && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 min-w-64"
            >
              <div className="space-y-2">
                <div className="font-medium text-sm mb-3">
                  Available Streams
                </div>
                {streams.map((stream) => (
                  <button
                    key={stream.id}
                    onClick={() => handleStreamSelect(stream)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentStream.id === stream.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStreamIcon(stream.type)}
                        <span className="text-sm font-medium">
                          {stream.language}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getQualityColor(
                            stream.quality
                          )}`}
                        >
                          {stream.quality}
                        </Badge>
                        {stream.isLive && (
                          <Badge variant="destructive" className="text-xs">
                            LIVE
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Stream Details */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Live Stream</h3>
              <p className="text-sm text-muted-foreground">
                {currentStream.language} • {currentStream.quality.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStreamIcon(currentStream.type)}
              <span className="text-sm text-muted-foreground">
                {currentStream.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
