var reactMountNode = document.querySelector("#react-mount-node");

function noop() {}

class JsonFileUpload extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { userInterfaceData: null };
        this.onChange = this.onChange.bind(this);
    }

    render() {
        if (!this.state.userInterfaceData) {
            return React.createElement("input", {
                onChange: this.onChange,
                type: "file",
            });
        }

        var sections = this.state.userInterfaceData.widgets[0].items;

        return React.createElement("div", { className: "container" },
            React.createElement("h1", { className: "text-center" }, this.state.userInterfaceData.widgets[0].name),
            React.createElement("a", { className: "link link-save" }, "Save"),
            React.createElement("a", { className: "link link-cancel" }, "Cancel"),
            sections.map(function(item, i) {
                return React.createElement(Section, {
                    header: item.header,
                    columns: item.columns,
                    items: item.items,
                    key: i,
                });
            })
        );
    }

    onChange(e) {
        var file = e.target.files[0];
        var self = this;

        if (!file.name.match(/\.json$/)) {
            console.warn("File type must be JSON");
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            try {
                self.setState({ userInterfaceData: JSON.parse(e.target.result) });
            } catch (e) {
                console.error("Error parsing the file: " + e);
            }
        };
        fileReader.readAsText(file);
    }
}

class Section extends React.PureComponent {
    render() {
        var maxColumns = 12;
        var inputElementWidth = maxColumns / this.props.columns;

        return React.createElement("div", { className: "form" },
            React.createElement("div", { className: "alert" }, this.props.header),
            React.createElement("div", { className: "form-row" },
                this.props.items.map(function(item, i) {
                    return React.createElement("div", { className: "form-group col-md-" + inputElementWidth, key: i },
                        React.createElement("label", {}, item.label),
                        item.symbol
                            ? React.createElement("div", { className: "input-group" },
                                React.createElement("div", { className: "input-group-prepend" },
                                    React.createElement("div", { className: "input-group-text" }, item.symbol)
                                ),
                                React.createElement("input", {
                                    className: "form-control",
                                    required: item.required,
                                    value: item.value,
                                    onChange: noop,
                                })
                            )
                            : React.createElement("input", {
                                className: "form-control",
                                required: item.required,
                                value: item.value,
                                onChange: noop,
                            })
                    );
                }),
            )
        );
    }
}

ReactDOM.render(React.createElement(JsonFileUpload), reactMountNode);