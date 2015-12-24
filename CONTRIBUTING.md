## Contribute

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

### Reporting Issues or Suggestions

If you find a bug in this project you're using (and you don't know how to fix it), have trouble following the documentation or have a question about the project,

 — create an issue! There's nothing to it and whatever issue you're having, you're likely not the only one, so others will find your issue helpful, too. For more information on how issues work, check out [Github Issues Guide](https://guides.github.com/features/issues/).

### Bug Reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful, so thanks!

Guidelines for bug reports:

0. **Validate and lint your code** &mdash; [validate your HTML](http://html5.validator.nu)
   and [lint your HTML](https://github.com/twbs/bootlint) to ensure your
   problem isn't caused by a simple error in your own code.

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `master` or development branch in the repository.

3. **Isolate the problem** &mdash; ideally create a [reduced test
   case](https://css-tricks.com/reduced-test-cases/) and a live example.
   [This JS Bin](http://jsbin.com/qusafa/edit?html,output) is a helpful template.


A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report. What is
your environment? What steps will reproduce the issue? What browser(s) and OS
experience the problem? Do other browsers show the bug differently? What
would you expect to be the outcome? All these details will help people to fix
any potential bugs.

Example:

> Short and descriptive example bug report title
>
> A summary of the issue and the browser/OS environment in which it occurs. If
> suitable, include the steps required to reproduce the bug.
>
> 1. This is the first step
> 2. This is the second step
> 3. Further steps, etc.
>
> `<url>` - a link to the reduced test case
>
> Any other information you want to share that is relevant to the issue being
> reported. This might include the lines of code that you have identified as
> causing the bug, and potential solutions (and your opinions on their
> merits).

### Issue Description

As with bug reports everywhere else:

- state the action(s) you took.
- explain what outcome you expected.
- describe the actual result, or upload a screenshot.
- note the version of relative tools, and which operating system you encountered the issue on, and which the shell you used (type `echo $SHELL` in your terminal if you are unsure).

## Feature Requests

Feature requests are welcome. But take a moment to find out whether your idea
fits with the scope and aims of the project. It's up to *you* to make a strong
case to convince the project's developers of the merits of this feature. Please
provide as much detai

### Pull Requests

- Please read [Github Help - Using pull requests](https://help.github.com/articles/using-pull-requests/) first.


**Every PR should only contain one feature change, bug fix or typo correction.**

Commits should be atomic units of work, if they are not you should rebase them
so that they are (typo corrections from a previous change for example do not
justify a commit).

The PR should clearly describe what problem the change fixes.
A feature addition with no justification and use-case will be rejected.

-----

Good pull requests — patches, improvements, new features — are a fantastic
help. They should remain focused in scope and avoid containing unrelated
commits.

**Please ask first** before embarking on any significant pull request (e.g.
implementing features, refactoring code, porting to a different language),
otherwise you risk spending a lot of time working on something that the
project's developers might not want to merge into the project.

Please adhere to the [coding guidelines](#code-guidelines) used throughout the
project (indentation, accurate comments, etc.) and any other requirements
(such as test coverage).

**Do not edit `bootstrap.css`, or `bootstrap.js`
directly!** Those files are automatically generated. You should edit the
source files in [`/bootstrap/scss/`](https://github.com/twbs/bootstrap/tree/master/scss)
and/or [`/bootstrap/js/`](https://github.com/twbs/bootstrap/tree/master/js) instead.

Similarly, when contributing to Bootstrap's documentation, you should edit the
documentation source files in
[the `/bootstrap/docs/` directory of the `master` branch](https://github.com/twbs/bootstrap/tree/master/docs).
**Do not edit the `gh-pages` branch.** That branch is generated from the
documentation source files and is managed separately by the Bootstrap Core Team.

Adhering to the following process is the best way to get your work
included in the project:

1. [Fork](https://help.github.com/fork-a-repo/) the project, clone your fork,
   and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/bootstrap.git
   # Navigate to the newly cloned directory
   cd bootstrap
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/twbs/bootstrap.git
   ```

2. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout master
   git pull upstream master
   ```

3. Create a new topic branch (off the main project development branch) to
   contain your feature, change, or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

4. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/interactive-rebase)
   feature to tidy up your commits before making them public.

5. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream master
   ```

6. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

7. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description against the `master` branch.

**IMPORTANT**: By submitting a patch, you agree to allow the project owners to
license your work under the terms of the [MIT License](LICENSE) (if it
includes code changes) and under the terms of the
[Creative Commons Attribution 3.0 Unported License](docs/LICENSE)
(if it includes documentation changes).


### Branching
**Work from and create pull requests on `development`, not `master`.**

- `master` branch always represents the latest release of this project. This branch
- `development` branch is where work is done for the next release.

### Code Style Guide
* Indent with tabs and align with spaces.
* Always use double brackets for `if` blocks


### Testing ###
Unless the code-change is a refactor, you should always add unit tests.  When
fixing a bug there should be a new test case that fails with the old code and
succeeds with the new code. When introducing a new feature, it should be
tested extensively, a single test case will not suffice.

Note that bats does not fail a test case when using double brackets.
To assert variable values and file existance you *must* use single brackets!

Also consider negative test cases (e.g. what happens when a non-existing
castlename is passed as an argument?).

You can read about the details of the testing framework in the
[testing documentation][].
[testing documentation]: https://github.com/andsens/homeshick/wiki/Testing

### Documentation

Add documentation for every API change. Feel free to send corrections or better docs!

### Git Commit Guidelines

refer to [AngularJS Commit Message Conventions](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)

### License

By contributing your code, you agree to license your contribution under the license this project used.

