# Gnome Extension for Window Transparency
This repository was used as a way to quickly iterate on changes for a GNOME extension running on Wayland. Unlike X11, Wayland has no way to restart the shell to test changes made when developing extensions for the GNOME shell without logging out and logging back in. Their recommended method of running a nested GNOME shell was also unsatisfactory for my needs as it frequently resulted in the entire shell freezing randomly. 

Therefore I decided the best way to quickly iterate changes was to run a virtual machine with the GNOME desktop with this repository cloned to the respective directory for GNOME extensions and just run a bash script on the home directory to pull changes from the local repository before logging out and logging back in inside the virtual machine's shell.

This allowed me to quickly test out the changes written from my native desktop, then testing it in a virtual desktop without resetting my development workspace containing the documentation and code editor.

While I eventually got basic window transparency working by changing the MetaWindowActor's opacity to 0.8, I was unsatisfied with this effect and wanted to experiment with GLSL shaders that drew transparent pixels based on a specified background color (white usually). This allowed most light-mode window backgrounds to be rendered semi-transparent but somehow caused bugs in GNOME's native screenshot feature whereby windows would render with odd colors. 

As a result of GNOME's extremely sparse documentation as well as waning interest in the project itself having already accomplished the basic goal of making the windows semi-transparent, I eventually moved on to other projects that would be more time-efficient in building a professional portfolio.

This repository is largely here for record-keeping and is no longer under active development.
