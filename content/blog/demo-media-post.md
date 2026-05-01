---
title: "Demo — Images and Embedded Video"
date: 2026-04-30
tags: ["demo", "media"]
summary: "A demo post showing how to include images and embed YouTube videos in blog posts."
draft: false
---

This post demonstrates two types of media you can include in any blog post: images and embedded YouTube videos.

## Images

Drop your image file into `static/img/` and reference it with a standard Markdown image tag:

```markdown
![Alt text](/img/your-image.jpg)
```

![Demo banner — replace with your own image](/img/demo-banner.svg)

Images are automatically styled with a subtle border and glow that fits the theme. Replace the placeholder above by swapping the file in `static/img/`.

## Embedded YouTube Video

Use the built-in `youtube` shortcode with just the video ID:

```
{{</* youtube TGJ9-1LWFtE */>}}
```

{{< youtube TGJ9-1LWFtE >}}

The embed is fully responsive — it scales correctly on mobile and desktop. The video ID is the part after `youtu.be/` or `?v=` in any YouTube URL.

## Putting it together

You can mix images, videos, and regular Markdown freely in any post. A few tips:

- Keep images in `static/img/` and name them clearly
- Use one video per post if possible — multiple embeds slow down page load
- Add a `summary` field in the front matter so the listing and home preview show a clean excerpt instead of the raw post text
