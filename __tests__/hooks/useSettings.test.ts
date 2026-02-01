import { renderHook, act } from "@testing-library/react";
import { useSettings } from "@/hooks/useSettings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize with default settings", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.appLanguage).toBe("pl");
    expect(result.current.settings.defaultTranslationLanguage).toBe("angielski");
    expect(result.current.settings.maxRecordingSeconds).toBe(60);
  });

  it("should update app language", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ appLanguage: "en" });
    });

    expect(result.current.settings.appLanguage).toBe("en");
  });

  it("should update default translation language", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ defaultTranslationLanguage: "niemiecki" });
    });

    expect(result.current.settings.defaultTranslationLanguage).toBe("niemiecki");
  });

  it("should update max recording seconds", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ maxRecordingSeconds: 120 });
    });

    expect(result.current.settings.maxRecordingSeconds).toBe(120);
  });

  it("should translate keys in Polish", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.t("tasks")).toBe("Zadania");
    expect(result.current.t("ideas")).toBe("Pomysły");
    expect(result.current.t("clickToRecord")).toBe("Kliknij, aby nagrać");
  });

  it("should translate keys in English", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({ appLanguage: "en" });
    });

    expect(result.current.t("tasks")).toBe("Tasks");
    expect(result.current.t("ideas")).toBe("Ideas");
    expect(result.current.t("clickToRecord")).toBe("Click to record");
  });

  it("should return key if translation not found", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.t("nonExistentKey")).toBe("nonExistentKey");
  });

  it("should update multiple settings at once", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.updateSettings({
        appLanguage: "en",
        maxRecordingSeconds: 180,
        defaultTranslationLanguage: "francuski",
      });
    });

    expect(result.current.settings.appLanguage).toBe("en");
    expect(result.current.settings.maxRecordingSeconds).toBe(180);
    expect(result.current.settings.defaultTranslationLanguage).toBe("francuski");
  });
});
