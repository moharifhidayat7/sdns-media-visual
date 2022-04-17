import { useNProgress } from "@tanem/react-nprogress";
import { RingProgress, Text, LoadingOverlay, Progress } from "@mantine/core";

const Loading = ({ isRouteChanging }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  });

  const loader = (
    <RingProgress
      sections={[{ value: (-1 + progress) * 100, color: "blue" }]}
      label={
        <Text color="blue" weight={700} align="center" size="xl">
          {(-1 + progress) * 100}%
        </Text>
      }
    />
  );

  return (
    <>
      <div
        style={{
          zIndex: 1500,
          position: "absolute",
          width: "100%",
          display: isFinished ? "none" : "unset",
        }}
      >
        <div style={{ height: "100vh", position: "relative" }}>
          <LoadingOverlay visible={isFinished} />
        </div>
      </div>
    </>
  );
};

export default Loading;
