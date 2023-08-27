class AddServiceDto {
    constructor(builder) {
        this.category = builder.category;
        this.addType = builder.addType;
        this.apiProviderId = builder.apiProviderId;
        this.apiServiceId = builder.apiServiceId;
        this.originalPrice = builder.originalPrice;
        this.min = builder.min;
        this.max = builder.max;
        this.name = builder.name;
        this.price = builder.price;
        this.status = builder.status;
        this.desc = builder.desc;
    }

    static builder() {
        return new AddServiceDtoBuilder()
    }
}

class AddServiceDtoBuilder {
    setCategory(category) {
        this.category = category;
        return this;
    }

    setAddType(addType) {
        this.addType = addType;
        return this;
    }

    setApiProviderId(apiProviderId) {
        this.apiProviderId = apiProviderId;
        return this;
    }

    setApiServiceId(apiServiceId) {
        this.apiServiceId = apiServiceId;
        return this;
    }

    setOriginalPrice(originalPrice) {
        this.originalPrice = originalPrice;
        return this;
    }

    setMin(min) {
        this.min = min;
        return this;
    }

    setMax(max) {
        this.max = max;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setPrice(price) {
        this.price = price;
        return this;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    setDesc(desc) {
        this.desc = desc;
        return this;
    }

    build() {
        return new AddServiceDto(this);
    }
}

module.exports = AddServiceDto