import { defineConfig, type DefaultTheme, type UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import type { VitePressSidebarOptions } from "vitepress-sidebar/types";

const config: UserConfig<DefaultTheme.Config> = {
  title: "OAuth / OIDC 自作入門",
  description: "OAuth / OIDC の仕組みを手を動かして理解する",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
    ],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    [
      "link",
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    ],
    ["link", { rel: "shortcut icon", href: "/favicon.ico" }],
    ["link", { rel: "manifest", href: "/site.webmanifest" }],
    [
      "meta",
      {
        property: "og:title",
        content: "OAuth / OIDC 自作入門",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content: "OAuth / OIDC の仕組みを手を動かして理解する",
      },
    ],
    [
      "meta",
      {
        property: "og:url",
        content: "https://coding-oidc.logica0419.dev",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://coding-oidc.logica0419.dev/image.png",
      },
    ],
    [
      "script",
      { type: "application/ld+json" },
      `{
        "@context" : "https://schema.org",
        "@type" : "WebSite",
        "name" : "OAuth / OIDC 自作入門",
        "url" : "https://coding-oidc.logica0419.dev/"
      }`,
    ],
  ],
  srcDir: ".",
  lastUpdated: true,
  sitemap: {
    hostname: "https://coding-oidc.logica0419.dev",
    lastmodDateOnly: false,
  },
  themeConfig: {
    nav: [{ text: "Home", link: "/" }],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/logica0419/coding-oidc",
      },
    ],
  },
};

const sidebarOptions: VitePressSidebarOptions = {
  documentRootPath: "/",
  collapsed: false,
  useTitleFromFileHeading: true,
  useFolderTitleFromIndexFile: true,
  useFolderLinkFromIndexFile: true,
};

export default defineConfig(withSidebar(config, sidebarOptions));
