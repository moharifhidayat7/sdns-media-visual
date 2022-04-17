import { useNProgress } from "@tanem/react-nprogress";
import {
  RingProgress,
  Text,
  LoadingOverlay,
  Progress,
  createStyles,
} from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
  container: {
    opacity: _params.isFinished ? 0 : 1,
    pointerevents: "none",
    transition: `opacity ${_params.animationDuration}ms linear`,
  },

  bar: {
    background: "#29d",
    height: "2px",
    left: 0,
    marginLeft: `${(-1 + _params.progress) * 100}%`,
    position: "fixed",
    top: 0,
    transition: `margin-left ${_params.animationDuration}ms linear`,
    width: "100%",
    zIndex: 1031,
  },

  spinner: {
    boxShadow: "0 0 10px #29d, 0 0 5px #29d",
    display: "block",
    height: "100%",
    opacity: 1,
    position: "absolute",
    right: 0,
    transform: "rotate(3deg) translate(0px, -4px)",
    width: "100px",
  },
}));
const Loading = ({ isRouteChanging }) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  });

  const { classes } = useStyles({ animationDuration, isFinished, progress });

  return (
    <>
      <div className={classes.container}>
        <div className={classes.bar}>
          <div className={classes.spinner} />
        </div>
      </div>
    </>
  );
};

export default Loading;
