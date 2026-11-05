export const formatTuition = (tuition: number) =>
  new Intl.NumberFormat("vi-VN").format(tuition);
