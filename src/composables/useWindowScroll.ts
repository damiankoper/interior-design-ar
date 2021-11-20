import { ref, onMounted, onUnmounted } from "vue";

export function useWindowScroll() {
  const isWindowScrolledToTop = ref(true);

  const onScroll = (event: Event) => {
    if (event.target instanceof Element) {
      isWindowScrolledToTop.value = event.target.scrollTop === 0;
    } else if (
      event.target instanceof Document &&
      event.target.scrollingElement
    ) {
      isWindowScrolledToTop.value =
        event.target.scrollingElement.scrollTop === 0;
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", onScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  });

  return {
    isWindowScrolledToTop,
  };
}
