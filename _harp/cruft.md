While discussing [why I thought a *mobile-first* architecture](./mobile-first.html) would be a good idea, I said that [the current OSLC site](http://open-services.net) has a lot of "excess functionality".

Here's what I mean by that.

I went through our site's current templates, CSS, and script files and here's all the various bits of layout/functionality that I found:


### Menus

- **Main menu**: Logo/Name/Home link, App links (Wiki, Forum, Mailing lists), page links, login/register area (folds down, except on the Forum where there's a dropdown???)
- **Tutorial**: Hierarchy of pages in the current tutorial; expands/collapses
- [Forums](http://open-services.net/forums/): Mark all read, view latest posts, private messages, [control panel](http://open-services.net/forums/member/profile/)
- **Wiki sidebar**: Create page, search, links
- **Wiki page controls**: edit, history, links

### Different lists of child pages

- [Blog posts](http://open-services.net/blog/): data, link/title, summary, RSS, Twitter roll. Reused for [tagged lists](http://open-services.net/blog/tag/community/)
- [Resources](http://open-services.net/resources/): link/titles and truncated description from all resource categories
- [Resource categories](http://open-services.net/resources/videos/): link/titles, descriptions
- [Presentations](http://open-services.net/resources/presentations/): dates, link/titles, flagged if upcoming
- [Workgroups](http://open-services.net/workgroups/): currently a table of descriptions and category/labels
- [Tutorials](http://open-services.net/resources/tutorials/integrating-products-with-oslc/): multi-page table of contents in the sidebar
- [Specifications](http://open-services.net/specifications/): table-like layout, headings, links/titles, progress bars, states
- [Software](http://open-services.net/software/): massive table, related specifications
- [Organizations](http://open-services.net/organizations/): Just a list, 3-columns
- [Wikis](http://open-services.net/wiki/): table with links/titles, categories, some have labels, link to years-old legacy wiki
- [Forums](http://open-services.net/forums/): I can't even&hellip; tables, mostly
- [Forum topics](http://open-services.net/forums/viewforum/19/): slightly different tables, search, subscriptions
- [Legal agreements](http://open-services.net/legal-agreements/): separated Members Agreement from technical workgroup WPAs, login/register area, buttons, tables


### Distinctly different page layouts

- [Home page](http://open-services.net/) only:
    - Introductory "hero" area
    - "What's new" area
    - "About Us" modules with image, heading, text
- [Blog post](http://open-services.net/blog/dont-get-stressed-talking-about-integrations/) only:
    - Centered content column
    - author + date metadata
    - "About this post" block with more metadata, related links
    - older/newer post blocks


### JavaScript modules

- Popover/tooltips
- Click-this-to-show-that togglers
- Tutorial navigation expand/collapse



The only somewhat consistent page elements are the title and the breadcrumbs. I guess that's something.